/** Storing the interval for incrementing seconds elapsed */
let interval;

/**
 * On 'starttimer' message from main script, start timer and interval.
 * Also take in the second value given as a starting point.
 *
 * On 'stoptimer' clear the interval.
 */
onmessage = (e) => {
    if (e.data[0] === 'starttimer') {
        let seconds = e.data[1];
        interval = setInterval(() => {
            seconds = seconds + 1;
            postMessage(['currentSeconds', seconds]);
        }, 1000);
    }

    if (e.data[0] === 'stoptimer') {
        clearInterval(interval);
    }
}