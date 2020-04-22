import JishoAPI, { KanjiParseResult } from 'unofficial-jisho-api'
import Command from "../meta/Command";
import ActivatedCommand from "../../models/ActivatedCommand";
import { RichEmbed } from "discord.js";

export default class KanjiCommand extends Command {

    public readonly name: string = 'kanji'
    public readonly description: string = 'Displays information about specified kanji(s)'

    private _api = new JishoAPI()

    public async execute(activatedCommand: ActivatedCommand): Promise<void> {
        try {
            const channel = activatedCommand.message.channel

            if (!activatedCommand.args.length) {
                channel.send('The command needs one kanji as an argument.\nLike this: `!kanji 猫`')
                return
            }

            const kanji = activatedCommand.args[0]
            const result = await this._api.searchForKanji(kanji)

            if (!result || !result.found) {
                channel.send(`No results found for: ${kanji}`)
                return
            }
            
            const resultEmbed = this.createEmbedResponse(kanji, result)
            await channel.send(resultEmbed)

        }
        catch (err) {
            activatedCommand.message.channel.send('Something went wrong!')
        }
    }

    private createEmbedResponse(kanji: string, result: KanjiParseResult): RichEmbed {
        const resultEmbed = new RichEmbed()
            .setColor('#32a852')
            .setTitle(`Result for: ${kanji}`)
            .setTimestamp()
            .setFooter('Powered by jisho.org', 'https://avatars1.githubusercontent.com/u/12574115')
            .addField('Meaning:', result.meaning, true)
            .addField('Parts:', result.parts.join(' '), true)
            .addBlankField()
            .addField('KUN Reading:', result.kunyomi[0], true)
            .addField('ON Reading:', result.onyomi[0], true)

        if (result.kunyomiExamples.length || result.onyomiExamples.length) {
            resultEmbed.addBlankField()

            if (result.kunyomiExamples.length) {
                const yomiText = this.createYomiText(result.kunyomiExamples[0])
                resultEmbed.addField('KUN Example:', yomiText, true)
            }

            if (result.onyomiExamples.length) {
                const yomiText = this.createYomiText(result.onyomiExamples[0])
                resultEmbed.addField('ON Example:', yomiText, true)
            }
            resultEmbed.addBlankField()
        }
            
        if (result.strokeOrderGifUri)
            resultEmbed.setImage(result.strokeOrderGifUri)
        
        return resultEmbed
    }
   
    private createYomiText(yomi: any): string {
        const exampleTxt = `Example: ${yomi.example}`
        const readingTxt = `Reading: ${yomi.reading}`
        const meaningTxt = `Meaning: ${yomi.meaning}`

        return `${exampleTxt}\n${readingTxt}\n${meaningTxt}`
    }


}