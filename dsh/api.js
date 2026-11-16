import { readFileSync } from 'node:fs'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleProfileWrite } from './profile-route.js'

const PUBLIC = fileURLToPath(new URL('../public/', import.meta.url))
const STATIC = new Set(['index.html','app.js','style.css','demo-data.js','primer-data.js','primer.js','primer.css'])
const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8'}
const PREFIX = '/api/traps-workbench'
function send(res,status,value,type='application/json; charset=utf-8') { res.writeHead(status,{'content-type':type,'cache-control':'no-store'}); res.end(type.startsWith('application/json')?JSON.stringify(value):value) }
async function readBody(req) {
  let size=0; const chunks=[]
  for await (const chunk of req) { size+=chunk.length; if(size>65536) throw Object.assign(new Error('请求体超过 64KB'),{status:413}); chunks.push(chunk) }
  try { return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {} } catch { throw Object.assign(new Error('JSON 解析失败'),{status:400}) }
}
function authorize(ctx,req,res) {
  if (typeof ctx.connection?.requestRejection !== 'function') { send(res,503,{error:'connection authentication capability unavailable'}); return false }
  const rejection=ctx.connection.requestRejection(req)
  if(rejection!==undefined){send(res,rejection,{error:'Authentication required'});return false}
  return true
}
export function createWorkbenchRoutes({ctx,workbench,version}) {
  const route=(path,methods,action)=>({kind:'exact',path:PREFIX+path,handler:async(req,res)=>{
    if(!authorize(ctx,req,res)) return
    if(!methods.includes(req.method)){send(res,405,{error:'Method not allowed'});return}
    try { const url=new URL(req.url,'http://localhost'); const result=await action(req,res,url); if(result!==undefined)send(res,200,result) }
    catch(error){send(res,error.status||500,{error:error.message||String(error)})}
  }})
  const routes=[
    route('/health',['GET'],()=>({ok:true,version,apiVersion:'v1',capabilities:['health','bootstrap','profiles','entries','flares','privacy','trials','root','ui']})),
    route('/bootstrap',['GET'],()=>workbench.bootstrap()),
    route('/subjects',['POST'],async(req)=>({ ...handleProfileWrite('POST','/subjects',await readBody(req),workbench),bootstrap:workbench.bootstrap()})),
    route('/entries',['POST'],async(req)=>{const b=await readBody(req);return {...workbench.addEntry(b.profileKey,b.kind,b.data),bootstrap:workbench.bootstrap()}}),
    route('/flares',['POST'],async(req)=>{const b=await readBody(req);return {...workbench.addFlare(b.profileKey,b.data),bootstrap:workbench.bootstrap()}}),
    route('/privacy',['POST'],async(req)=>{const b=await readBody(req);return {...workbench.setPrivacy(b.profileKey,b.kind,b.id,!!b.private),bootstrap:workbench.bootstrap()}}),
    route('/saved-trials',['POST'],async(req)=>{const b=await readBody(req);return {...workbench.saveTrial(b.profileKey,b.trialKey,b.state),bootstrap:workbench.bootstrap()}}),
    route('/trials',['GET'],(_req,_res,url)=>workbench.trialMatch(url.searchParams.get('keyword')||'')),
    route('/root',['GET','POST'],async(req)=>{if(req.method==='GET')return {ok:true,...workbench.currentRootInfo()};const b=await readBody(req);return {ok:true,...workbench.setRoot(b.dir)}}),
  ]
  const serve=(name)=>route('/ui/'+(name==='index.html'?'':name),['GET'],(_req,res)=>{
    const body=readFileSync(resolve(PUBLIC,name)); send(res,200,body,MIME[extname(name)]||'application/octet-stream'); return undefined
  })
  routes.push(serve('index.html'),... [...STATIC].filter(n=>n!=='index.html').map(serve))
  return routes
}
