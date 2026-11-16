import test from 'node:test'
import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Workbench } from '../dsh/workbench.js'
import { createWorkbenchRoutes } from '../dsh/api.js'

const root=mkdtempSync(join(tmpdir(),'traps-host-api-'))
test.after(()=>rmSync(root,{recursive:true,force:true}))
const workbench=new Workbench({root})
test.after(()=>workbench.close())
const ctx={connection:{requestRejection:()=>undefined}}
const routes=createWorkbenchRoutes({ctx,workbench,version:'0.2.0'})
async function call(path,method='GET',payload=null){
 const descriptor=routes.find((r)=>r.path==='/api/traps-workbench'+path)
 assert.ok(descriptor,`route ${path}`)
 const req=Readable.from(payload===null?[]:[Buffer.from(JSON.stringify(payload))]); req.method=method; req.url='/api/traps-workbench'+path
 const res={writeHead(status,headers){this.status=status;this.headers=headers},end(body){this.body=body}}
 await descriptor.handler(req,res); const raw=String(res.body||''); return {status:res.status,body:res.headers?.['content-type']?.startsWith('application/json')?JSON.parse(raw):raw}
}

test('host route table exposes guarded bootstrap, profile creation and static business UI',async()=>{
 const health=await call('/health');assert.equal(health.status,200);assert.ok(health.body.capabilities.includes('flares'))
 const profile=await call('/subjects','POST',{name:'Host API test profile'})
 assert.equal(profile.status,200);assert.ok(profile.body.bootstrap.profiles.some(p=>p.id===profile.body.profileKey))
 const html=await call('/ui/');assert.equal(html.status,200);assert.ok(html.body.includes('<!doctype html>'))
})
