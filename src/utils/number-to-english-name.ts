const numberNames: { [key: string]: string } = {
    '1': 'one',
    '2': 'two',
    '3': 'three',
    '4': 'four',
    '5': 'five'
}

/**
 * Needed for converting the different JLPT levels number into a string.
 */
export default function numberToEnglishName(number: string | number): string {
    number = (typeof number === 'number') ? number.toString() : number
    return numberNames[number]
}
