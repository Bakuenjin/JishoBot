import c from 'config'
import { Client } from 'discord.js'
import ModuleManager from './bot-modules/ModuleManager'
import settings from './settings/Settings'
import sleep from './utils/sleep'

export const client = new Client()
const moduleManager = ModuleManager.getInstance()

async function login() {
    const token = c.get<string>('discord.token')
    await client.login(token)
}

async function reconnect() {
    try { await login() }
    catch (err) {
        await sleep(30000)
        reconnect()
    }
}

async function init() {
    try {
        await login()
        moduleManager.setupModules(settings.modules)
    }
    catch (err) {  }
}

client.on('disconnect', _ => reconnect())
init()