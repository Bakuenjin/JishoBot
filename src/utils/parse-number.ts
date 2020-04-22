/**
 * Parses a string into an int number.
 * If the parse fails, the default value is returned.
 */
export function parseIntNumber(num: string, defaultValue: number): number {
    if(!num) return defaultValue

    const parsedNum = parseInt(num)
    return isNaN(parsedNum) ? defaultValue : parsedNum
}

/**
 * Parses a string into a float number.
 * If the parse fails, the default value is returned.
 */
export function parseFloatNumber(num: string, defaultValue: number): number {
    if (!num) return defaultValue

    const parsedNum = parseFloat(num)
    return isNaN(parsedNum) ? defaultValue : parsedNum
}