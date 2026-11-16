#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { DatabaseSync } from 'node:sqlite'
import { dirname, join, resolve } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'

const args=process.argv.slice(2), optional=args.includes('--if-present'), SELF_TEST=args.includes('--self-test')
const positional=args.filter((arg)=>!arg.startsWith('-'))
const target=resolve(positional[0]||'.'), errors=[]
const sha256=(bytes)=>createHash('sha256').update(bytes).digest('hex')
const fields=[
 ['recordId','record_id',false],['mergedSources','merged_sources',true],['sourceId','source_id',false],
 ['title','title',false],['studyType','study_type',false],['sponsor','sponsors',true],
 ['registryNumbers','registry_numbers',true],['dates','dates',true],['sourceUrl','source_url',false],
 ['retrievedAt','retrieved_at',false],['statusNote','status_note',false],['snapshotDate','snapshot_date',false]
]
const parseJson=(value,label)=>{
 if(value===null||value===undefined) return null
 try{return JSON.parse(value)}catch(error){throw new Error(`${label} is not valid JSON: ${error.message}`)}
}
const equal=isDeepStrictEqual

async function isSnapshotDirectory(dir) {
 try{
  const manifest=JSON.parse(await readFile(join(dir,'manifest.json'),'utf8'))
  const names=Object.keys(manifest.files||{})
  return names.some((name)=>name.endsWith('.jsonl'))&&names.some((name)=>name.endsWith('.sqlite')||name.endsWith('.db'))
 }catch(error){if(error.code==='ENOENT')return false;throw error}
}

async function findSnapshots(dir) {
 let entries=[]
 try{entries=await readdir(dir,{withFileTypes:true})}catch(error){if(error.code==='ENOENT')return [];throw error}
 const found=[]
 for(const entry of entries){
  if(!entry.isDirectory()||entry.name==='node_modules'||entry.name.startsWith('.'))continue
  const child=join(dir,entry.name)
  if(entry.name==='research') found.push(...await findSnapshots(child))
  else if(await isSnapshotDirectory(child))found.push(child)
 }
 return found
}

async function checkSnapshot(dir) {
 const manifestPath=join(dir,'manifest.json')
 let manifest
 try{manifest=JSON.parse(await readFile(manifestPath,'utf8'))}
 catch(error){errors.push(`${dir}: cannot read manifest.json: ${error.message}`);return}
 const files=Object.keys(manifest.files||{})
 if(!files.length) errors.push(`${dir}: manifest.files is empty`)
 const bytesByName=new Map()
 for(const name of files){
  if(name.includes('/')||name.includes('\\')||name==='.'||name==='..') {errors.push(`${dir}: unsafe manifest filename ${name}`);continue}
  try{
   const bytes=await readFile(join(dir,name));bytesByName.set(name,bytes)
   const expected=manifest.files[name]?.sha256
   if(typeof expected!=='string'||sha256(bytes)!==expected)errors.push(`${dir}: SHA-256 mismatch for ${name}`)
  }catch(error){errors.push(`${dir}: cannot read ${name}: ${error.message}`)}
 }
 const jsonlName=files.find((name)=>name.endsWith('.jsonl'))
 const dbName=files.find((name)=>name.endsWith('.sqlite')||name.endsWith('.db'))
 if(!jsonlName||!dbName){errors.push(`${dir}: manifest must list one JSONL and one SQLite file`);return}
 if(!bytesByName.has(jsonlName)||!bytesByName.has(dbName))return
 let rows
 try{
  const text=bytesByName.get(jsonlName).toString('utf8')
  rows=text.split(/\r?\n/).filter((line)=>line.trim()).map((line,index)=>{
   try{return JSON.parse(line)}catch(error){throw new Error(`JSONL line ${index+1}: ${error.message}`)}
  })
 }catch(error){errors.push(`${dir}: ${error.message}`);return}
 const rowMap=new Map()
 for(const row of rows){
  if(typeof row.recordId!=='string'||!row.recordId){errors.push(`${dir}: JSONL record has no recordId`);continue}
  if(rowMap.has(row.recordId))errors.push(`${dir}: duplicate JSONL recordId ${row.recordId}`)
  rowMap.set(row.recordId,row)
 }
 if(manifest.recordCount!==rows.length)errors.push(`${dir}: manifest recordCount ${manifest.recordCount} != JSONL ${rows.length}`)

 let db
 try{db=new DatabaseSync(join(dir,dbName),{readOnly:true})}
 catch(error){errors.push(`${dir}: cannot open SQLite read-only: ${error.message}`);return}
 try{
  const integrity=db.prepare('PRAGMA integrity_check').all().map((row)=>Object.values(row)[0])
  if(integrity.length!==1||integrity[0]!=='ok')errors.push(`${dir}: SQLite integrity_check failed: ${integrity.join('; ')}`)
  const columns=new Set(db.prepare('PRAGMA table_info(trials)').all().map((row)=>row.name))
  for(const [,column] of fields) if(!columns.has(column))errors.push(`${dir}: SQLite trials table missing column ${column}`)
  const dbRows=db.prepare('SELECT * FROM trials').all()
  const dbMap=new Map(dbRows.map((row)=>[row.record_id,row]))
  if(manifest.dbCount!==dbRows.length)errors.push(`${dir}: manifest dbCount ${manifest.dbCount} != SQLite ${dbRows.length}`)
  if(rows.length!==dbRows.length)errors.push(`${dir}: JSONL ${rows.length} != SQLite ${dbRows.length}`)
  for(const id of rowMap.keys()){
   const sql=dbMap.get(id)
   if(!sql){errors.push(`${dir}: ${id} exists in JSONL but not SQLite`);continue}
   const source=rowMap.get(id)
   for(const [jsonKey,sqlKey,isJson] of fields){
    let actual=sql[sqlKey]
    try{if(isJson)actual=parseJson(actual,`${id}.${sqlKey}`)}catch(error){errors.push(`${dir}: ${error.message}`);continue}
    const expected=source[jsonKey]??null
    if(!equal(expected,actual))errors.push(`${dir}: field mismatch ${id}.${jsonKey} (SQLite ${sqlKey})`)
   }
  }
  for(const id of dbMap.keys())if(!rowMap.has(id))errors.push(`${dir}: ${id} exists in SQLite but not JSONL`)

  const statuses=db.prepare('SELECT query,source_id,state FROM source_statuses').all()
  if(manifest.sourceStatusRows!==statuses.length)errors.push(`${dir}: manifest sourceStatusRows ${manifest.sourceStatusRows} != SQLite ${statuses.length}`)
  const statusKeys=new Set()
  for(const row of statuses){
   const key=JSON.stringify([row.query,row.source_id])
   if(statusKeys.has(key))errors.push(`${dir}: duplicate source status ${row.query}/${row.source_id}`)
   statusKeys.add(key)
  }
  console.log(`CHECK ${dir}: records=${rows.length}/${dbRows.length} sourceStatuses=${statuses.length}`)
 }catch(error){errors.push(`${dir}: SQLite validation failed: ${error.message}`)}
 finally{db.close()}
}

/* --self-test：先造一个合法快照（必须 PASS），再改坏 JSONL（必须 FAIL）。
   证明对账不是“只会在空目录报错”，字段/hash/计数任一漂移都能红。 */
if (SELF_TEST) {
 const root=mkdtempSync(join(tmpdir(),'mpn-snapshot-selftest-'))
 const row={recordId:'NCT00000001',mergedSources:['ctv'],sourceId:'ctv',title:'Self-test trial',studyType:'Interventional',sponsor:['Test Sponsor'],registryNumbers:['NCT00000001'],dates:{start:'2026-01-01'},sourceUrl:'https://clinicaltrials.gov/study/NCT00000001',retrievedAt:'2026-11-15T00:00:00.000Z',statusNote:'登记状态，未核实',snapshotDate:'2026-11-15'}
 const make=async(dir,tamper,hashTamper)=>{
  mkdirSync(dir,{recursive:true})
  const jsonl=JSON.stringify(row)+'\n'
  writeFileSync(join(dir,'trials.jsonl'),jsonl)
  const db=new DatabaseSync(join(dir,'trials.sqlite'))
  db.exec(`CREATE TABLE trials(record_id TEXT PRIMARY KEY,merged_sources TEXT,source_id TEXT,title TEXT,study_type TEXT,sponsors TEXT,registry_numbers TEXT,dates TEXT,source_url TEXT,retrieved_at TEXT,status_note TEXT,snapshot_date TEXT,conditions_json TEXT,phase_json TEXT,countries_json TEXT,eligibility_text TEXT,summary TEXT,raw_json TEXT,relevant INTEGER);
   CREATE TABLE source_statuses(query TEXT,source_id TEXT,state TEXT);`)
  db.prepare(`INSERT INTO trials VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(row.recordId,JSON.stringify(row.mergedSources),row.sourceId,tamper?row.title+' TAMPERED':row.title,row.studyType,JSON.stringify(row.sponsor),JSON.stringify(row.registryNumbers),JSON.stringify(row.dates),row.sourceUrl,row.retrievedAt,row.statusNote,row.snapshotDate,'[]','[]','[]','','',JSON.stringify(row),1)
  db.prepare('INSERT INTO source_statuses VALUES(?,?,?)').run('myelofibrosis','ctv','SUCCESS')
  db.close()
  const manifest={snapshotDate:row.snapshotDate,recordCount:1,dbCount:1,sourceStatusRows:1,files:{'trials.jsonl':{sha256:hashTamper?'0'.repeat(64):sha256(Buffer.from(jsonl)),bytes:Buffer.byteLength(jsonl)},'trials.sqlite':{sha256:sha256(await readFile(join(dir,'trials.sqlite'))),bytes:1}}}
  writeFileSync(join(dir,'manifest.json'),JSON.stringify(manifest,null,2))
 }
 const goodDir=join(root,'good'), badDir=join(root,'bad'), hashDir=join(root,'hash')
 await make(goodDir,false); await make(badDir,true); await make(hashDir,false,true)
 const run=(dir)=>spawnSync(process.execPath,[new URL(import.meta.url).pathname,dir],{encoding:'utf8'})
 const good=run(goodDir), bad=run(badDir), hashBad=run(hashDir)
 const ok=good.status===0&&bad.status!==0&&hashBad.status!==0&&/FAIL/.test(bad.stdout+bad.stderr)&&/SHA-256/.test(hashBad.stdout+hashBad.stderr)
 console.log(JSON.stringify({selfTest:ok?'PASS':'FAIL',goodExit:good.status,badExit:bad.status,hashExit:hashBad.status,badMessage:(bad.stderr||bad.stdout).split('\n').filter((l)=>l.startsWith('FAIL')).slice(0,2),hashMessage:(hashBad.stderr||hashBad.stdout).split('\n').filter((l)=>l.includes('SHA-256')).slice(0,2)},null,2))
 rmSync(root,{recursive:true,force:true})
 process.exit(ok?0:1)
}
let snapshots=[]
try{
 const stat=await import('node:fs/promises').then(({stat})=>stat(target))
 if(stat.isDirectory()&&await isSnapshotDirectory(target))snapshots=[target]
 else snapshots=await findSnapshots(target)
}catch(error){errors.push(`Cannot inspect ${target}: ${error.message}`)}
if(!snapshots.length){
 if(optional){console.log(`SKIP no clinical snapshot found under ${target}`)}
 else errors.push(`No clinical snapshot found under ${target}`)
}
for(const dir of snapshots) await checkSnapshot(dir)
if(errors.length){
 for(const error of errors.slice(0,50))console.error(`FAIL ${error}`)
 if(errors.length>50)console.error(`FAIL … ${errors.length-50} more errors`)
 console.log(`FAIL snapshot consistency: ${errors.length} issue(s)`)
 process.exitCode=1
}else if(snapshots.length){
 console.log(`PASS snapshot consistency: ${snapshots.length} snapshot(s)`)
}
