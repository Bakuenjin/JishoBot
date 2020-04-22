import c from 'config'
import Command from '../bot-commands/meta/Command'
import Module from '../bot-modules/meta/Module'
import CommandManagerModule from '../bot-modules/modules/CommandManagerModule'
import JishoCommand from '../bot-commands/commands/JishoCommand'
import KanjiCommand from '../bot-commands/commands/KanjiCommand'
import KanjiExampleCommand from '../bot-commands/commands/KanjiExampleCommand'

class BakaEngineBotSettings {

    public readonly modules: Module[] = [
        new CommandManagerModule()
    ]

    public readonly commands: Command[] = [
        new JishoCommand(),
        new KanjiCommand(),
        new KanjiExampleCommand()
    ]

    public readonly prefix = c.get<string>('discord.prefix')
    public readonly usersWithMinecraftRights = c.get<string[]>('discord.minecraftRights')

}

const settings = new BakaEngineBotSettings()
export default settings