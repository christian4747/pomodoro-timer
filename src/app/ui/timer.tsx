import { PiArrowClockwiseBold } from "react-icons/pi";
import { IoMdSkipForward } from "react-icons/io";
import { secondsToTimeString } from "../lib/utils";
import { useState, useEffect, useRef } from 'react';

interface Props {
    timeSeconds: number
    setTimeSeconds: React.Dispatch<React.SetStateAction<number>>
    intervalRef: React.MutableRefObject<undefined | NodeJS.Timeout>
    timerType: string
    setTimerType: React.Dispatch<React.SetStateAction<string>>
    timerInfo: {pomodoro: number, shortbreak: number, longbreak: number}
    colorInfo: {pomodoro: string, shortbreak: string, longbreak: string}
}

export default function Timer(props: Props) {

    const [timerRunning, setTimerRunning] = useState(false);
    const [cycleCount, setCycleCount] = useState(1);
    let worker = useRef<undefined | Worker>(undefined);

    useEffect(() => {
        worker.current = new Worker(new URL("../worker/worker.js", import.meta.url), { type: 'module' });

        worker.current.onmessage = (e) => {
            if (e.data[0] === 'currentSeconds') {
                props.setTimeSeconds(e.data[1]);
            }
            
        }
    }, [])

    useEffect(() => {
        if (props.timeSeconds === props.timerInfo.pomodoro && props.timerType === 'pomodoro'
        || props.timeSeconds === props.timerInfo.shortbreak && props.timerType === 'shortbreak'
        || props.timeSeconds === props.timerInfo.longbreak && props.timerType === 'longbreak'
        || props.timeSeconds > props.timerInfo.pomodoro && props.timerType === 'pomodoro'
        || props.timeSeconds > props.timerInfo.shortbreak && props.timerType === 'shortbreak'
        || props.timeSeconds > props.timerInfo.longbreak && props.timerType === 'longbreak') {
            if (worker.current != undefined) {
                worker.current.postMessage(['stoptimer']);
            }

            clearInterval(props.intervalRef.current);
            props.intervalRef.current = undefined;
            setTimerRunning(false);
            configureTimer();
            // alert('timer finished');
        }
    }, [props.timeSeconds]);

    const rotateType = (currentType : string) => {
        if (currentType == 'pomodoro' && cycleCount == 4) {
            return 'longbreak';
        } else if (currentType == 'pomodoro') {
            return 'shortbreak';
        }
        return 'pomodoro';
    }

    const configureTimer = () => {
        let next = rotateType(props.timerType);
        props.setTimeSeconds(0);
        props.setTimerType(next);
        setCycleCount((cycleCount) => cycleCount + 1);
    }

    const resetTimer = () => {
        if (worker.current != undefined) {
            worker.current.postMessage(['stoptimer']);
        }
        props.setTimeSeconds(0);
        clearInterval(props.intervalRef.current);
        props.intervalRef.current = undefined;
        setTimerRunning(false);
    }

    const toggleTimer = () => {
        setTimerRunning((timerRunning) => !timerRunning);
        if (worker.current != undefined) {
            if (!timerRunning) {
                worker.current.postMessage(['starttimer', props.timeSeconds]);
            } else {
                worker.current.postMessage(['stoptimer']);
            }
        } else {
            if (props.intervalRef.current != null) {
                clearInterval(props.intervalRef.current);
                props.intervalRef.current = undefined;
            } else {
                props.intervalRef.current = setInterval(() => {
                    props.setTimeSeconds(prevState => prevState + 1);
                }, 1000);
            }
        }
    }

    const skipTimer = () => {
        if (worker.current != undefined) {
            worker.current.postMessage(['stoptimer']);
        }

        configureTimer();
    }

    const swapToPomodoro = () => {
        if (props.timerType === 'pomodoro') {
            return;
        }
        resetTimer();
        props.setTimerType('pomodoro');
    }

    const swapToShortBreak = () => {
        if (props.timerType === 'shortbreak') {
            return;
        }
        resetTimer();
        props.setTimerType('shortbreak');
    }

    const swapToLongBreak = () => {
        if (props.timerType === 'longbreak') {
            return;
        }
        resetTimer();
        props.setTimerType('longbreak');
    }

    return (
        <>
            <div className="flex gap-1">
                <button className="border border-black rounded p-2" onClick={swapToPomodoro}>Pomodoro</button>
                <button className="border border-black rounded p-2" onClick={swapToShortBreak}>Short Break</button>
                <button className="border border-black rounded p-2" onClick={swapToLongBreak}>Long Break</button>
            </div>

            <div className="border border-black w-full h-full text-8xl p-5 text-center">
                {
                    props.timerType === 'pomodoro' ? secondsToTimeString(props.timerInfo.pomodoro - props.timeSeconds)
                    : props.timerType === 'shortbreak' ? secondsToTimeString(props.timerInfo.shortbreak - props.timeSeconds)
                    : secondsToTimeString(props.timerInfo.longbreak - props.timeSeconds)
                }
            </div>

            <div className="flex gap-5">
                <button onClick={resetTimer} className="text-4xl"><PiArrowClockwiseBold /></button>
                <button onClick={toggleTimer} className="border border-black rounded text-4xl p-3">
                    {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={skipTimer} className="text-4xl"><IoMdSkipForward /></button>
            </div>

            <div>
                #{cycleCount !== 1 ? props.timerType === 'pomodoro' ? cycleCount : cycleCount - 1 : cycleCount}
            </div>
        </>
    );
}