import { RichEmbed } from "discord.js";
import JishoAPI, { JishoResult } from 'unofficial-jisho-api'
import Command from "../meta/Command";
import ActivatedCommand from "../../models/ActivatedCommand";
import numberToEnglishName from "../../utils/number-to-english-name";
import { parseIntNumber } from "../../utils/parse-number";

export default class JishoCommand implements Command {

    public readonly name: string = 'jisho'
    public readonly description: string = 'Searches jisho.org for the specified phrase'

    private _api = new JishoAPI()

    public async execute(activatedCommand: ActivatedCommand): Promise<void> {
        try {
            const channel = activatedCommand.message.channel
            
            if (!activatedCommand.args.length) {
                channel.send('The command needs a phrase to search for.\nLike this: `!jisho family`.')
                return
            }

            const phrase = activatedCommand.args[0]
            const resultAmount = parseIntNumber(activatedCommand.args[1], 1)
            const result = await this._api.searchForPhrase(phrase)

            if (!result.data.length) {
                channel.send(`No results found for phrase '${phrase}'.`)
                return
            }

            const resultEmbed = this.createEmbedResponse(phrase, resultAmount,result.data)
            await channel.send(resultEmbed)
        } 
        catch (err) {
            activatedCommand.message.channel.send('Something went wrong!')
        }
    }

    private createEmbedResponse(phrase: string, amount: number, results: JishoResult[]): RichEmbed { 
        const realAmount = amount > results.length ? results.length : amount
        const resultEmbed = new RichEmbed()
            .setColor('#32a852')
            .setTitle(`${realAmount} result${realAmount > 1 ? 's' : ''} for '**${phrase}**':`)
            .setTimestamp()
            .setFooter('Powered by jisho.org', 'https://avatars1.githubusercontent.com/u/12574115')
        
        let count = 0

        while (count < realAmount) {
            const currentResult = results[count]
            const japaneseInfo = `${currentResult.japanese[0].word} | ${currentResult.japanese[0].reading}`
            const englishInfo = currentResult.senses[0].english_definitions.join(', ')
            const miscInfos = [ `Common:\t${currentResult.is_common ? ':white_check_mark:' : ':x:'}`]

            if (currentResult.jlpt[0])
                miscInfos.push(`JLPT Level:\t:regional_indicator_n::${numberToEnglishName(currentResult.jlpt[0].charAt(currentResult.jlpt[0].length - 1))}:`)

            resultEmbed
                .addField('Japanese:', japaneseInfo, true)
                .addField('English:', englishInfo, true)
                .addField('Other Information:', miscInfos.join('\n'))

            count++
            if (count < realAmount)
                resultEmbed.addBlankField()
        }

        return resultEmbed
    }

}