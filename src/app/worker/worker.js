let interval;

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