#!/usr/bin/env node
/* Deterministic demo projection: data/demo-data.json -> prototypes/v0.2/demo-data.js. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const source = JSON.parse(readFileSync(join(root, 'data/demo-data.json'), 'utf8'))
const output = '/* Generated from data/demo-data.json. All patient records are synthetic. */\nwindow.DEMO_DATA = ' + JSON.stringify(source, null, 2) + ';\n'
const target = join(root, 'prototypes/v0.2/demo-data.js')
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, output)
console.log(`demo-data: ${source.profiles.length} profiles, ${source.profiles.reduce((n,p)=>n+(p.metrics||[]).length,0)} metrics, ${source.profiles.reduce((n,p)=>n+(p.entries||[]).length,0)} entries`)
