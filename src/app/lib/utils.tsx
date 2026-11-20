/**
 * Returns a string formatted in {minutes:seconds} based on the given number.
 * @param {int} seconds the number of seconds to convert to {minutes:seconds}
 * @returns the {minutes:seconds} string that corresponds to the given amount of seconds
 */
export const secondsToTimeString = (seconds: number) => {
    return seconds < 0 ? '00:00' :
        seconds / 60 < 10 ?
        seconds % 60 < 10 ? `0${Math.floor(seconds / 60)}:0${seconds % 60}`
            : `0${Math.floor(seconds / 60)}:${seconds % 60}`
        :
        seconds % 60 < 10 ? `${Math.floor(seconds / 60)}:0${seconds % 60}`
            : `${Math.floor(seconds / 60)}:${seconds % 60}`;
}

/**
 * Receives min if the given number is less than the min, or max if the given number is greater than the max.
 * @param num the number to clamp
 * @param min the minimum bound
 * @param max the maximum bound
 * @returns number between min and max
 */
export const clamp = (num: number, min: number, max: number) => {
    return num > min ? num < max ? num : max : min;
}

/**
 * Reads and parses a JSON value saved in localStorage.
 * Returns null if nothing is stored, the stored value is not valid JSON, or storage is unavailable,
 * so corrupted saved data can't crash the page on load.
 * @param key the localStorage key to read
 * @returns the parsed value, or null
 */
export const loadFromStorage = <T,>(key: string): T | null => {
    try {
        const stored = localStorage.getItem(key);
        return stored === null ? null : JSON.parse(stored) as T;
    } catch {
        return null;
    }
}