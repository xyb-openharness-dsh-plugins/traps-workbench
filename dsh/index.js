import Schema from '@deepseek-ai/schemastery'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { Workbench } from './workbench.js'
import { createWorkbenchRoutes } from './api.js'

export const name = 'traps-workbench-main'
export const inject = ['webServer', 'connection']
export const Config = Schema.object({ root: Schema.string() })
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

export function apply(ctx, config = {}) {
  if (!ctx.webServer?.register) throw new Error('Desktop webServer.register is unavailable')
  const root = resolve(config?.root || join(homedir(), '.traps-workbench'))
  const workbench = new Workbench({ root })
  ctx.effect(() => {
    const cleanups = createWorkbenchRoutes({ ctx, workbench, version: manifest.version }).map((descriptor) => ctx.webServer.register(descriptor))
    return () => { for (const cleanup of cleanups) { if (typeof cleanup === 'function') cleanup() }; workbench.close() }
  }, 'traps-workbench API')
}
