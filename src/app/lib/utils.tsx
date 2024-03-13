/**
 * Returns a string formatted in {minutes:seconds} based on the given number.
 * @param {int} seconds the number of seconds to convert to {minutes:seconds}
 * @returns the {minutes:seconds} string that corresponds to the given amount of seconds
 */
export const secondsToTimeString = (seconds: number) => {
    return seconds / 60 < 10 ?
        seconds % 60 < 10 ? `0${Math.floor(seconds / 60)}:0${seconds % 60}`
            : `0${Math.floor(seconds / 60)}:${seconds % 60}`
        :
        seconds % 60 < 10 ? `${Math.floor(seconds / 60)}:0${seconds % 60}`
            : `${Math.floor(seconds / 60)}:${seconds % 60}`;
}