import Command from "../meta/Command";
import JishoAPI, { ExampleParseResult } from "unofficial-jisho-api";
import ActivatedCommand from "../../models/ActivatedCommand";
import { RichEmbed } from "discord.js";
import { parseIntNumber } from "../../utils/parse-number";

export default class KanjiExampleCommand extends Command {

    public readonly name: string = 'kanji-example'
    public readonly description: string = 'Looksup example sentences for the specified kanji.'

    private _api = new JishoAPI()

    public async execute(activatedCommand: ActivatedCommand): Promise<void> {
        try {
            const channel = activatedCommand.message.channel

            if (!activatedCommand.args.length) {
                channel.send('The command needs a phrase as an argument.\nLike this: `!kanji-example 猫`')
            }

            const phrase = activatedCommand.args[0]
            const resultAmount = parseIntNumber(activatedCommand.args[1], 1)
            const result = await this._api.searchForExamples(phrase)

            if (!result || !result.found) {
                channel.send(`No results found for: ${phrase}`)
                return
            }

            const resultEmbed = this.createEmbedResponse(phrase, resultAmount, result)
            await channel.send(resultEmbed)
        }
        catch (err) {
            activatedCommand.message.channel.send('Something went wrong!')    
        }
    }

    private createEmbedResponse(phrase: string, amount: number, result: ExampleParseResult): RichEmbed {
        const realAmount = amount > result.results.length ? result.results.length : amount
        const resultEmbed = new RichEmbed()
            .setColor('#32a852')
            .setTitle(`Examples for phrase: ${phrase}`)
            .setTimestamp()
            .setFooter('Powered by jisho.org', 'https://avatars1.githubusercontent.com/u/12574115')
    
        let count = 0

        while(count < realAmount) {
            const currentResult = result.results[count]          
            resultEmbed
                .addField('With Kanji:', currentResult.kanji)
                .addField('Kana Only:', currentResult.kana)
                .addField('English Translation (Click to show):', `||${currentResult.english}||`)
            
            count++
            if (count < realAmount)
                resultEmbed.addBlankField()
        }

        return resultEmbed
    }

}