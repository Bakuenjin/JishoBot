import { Message } from "discord.js";
import stringArgv from 'string-argv'
import ActivatedCommand from "../models/ActivatedCommand";

/**
 * Checks and converts the message into an instance of the ActivatedCommand class.
 */
export default function convertMsgToActivatedCommand(msg: Message, prefix: string): ActivatedCommand | undefined {
    // Ignore other bot messages
    if (msg.author.bot)
        return
    
    // Check if the message starts with the specified prefix.
    if (!msg.content.startsWith(prefix))
        return

    const args: string[] = stringArgv(msg.content.substring(prefix.length))
    const name = args.shift()
    // Check if only the prefix was typed (no command specified)
    if (!name)
        return

    return new ActivatedCommand(name.toLowerCase(), args, msg)
}