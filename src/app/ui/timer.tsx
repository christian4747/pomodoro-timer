import { PiArrowClockwiseBold } from "react-icons/pi";
import { IoMdSkipForward } from "react-icons/io";
import { secondsToTimeString } from "../lib/utils";
import { useState, useEffect, useRef } from 'react';

export default function Timer() {

    const [timerRunning, setTimerRunning] = useState(false);
    const [timerType, setTimerType] = useState('pomodoro');
    const [timeSeconds, setTimeSeconds] = useState(600);
    const intervalRef = useRef<undefined | NodeJS.Timeout>(undefined);

    useEffect(() => {
        if (timeSeconds == 0) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
            setTimerRunning(false);
            configureTimer();
        }
    }, [timeSeconds]);

    const rotateType = (currentType : string) => {
        if (currentType == 'pomodoro') {
            return 'shortbreak';
        }
        return 'pomodoro';
    }

    const configureTimer = () => {
        let next = rotateType(timerType);

        if (next == 'pomodoro') {
            setTimeSeconds(600);
        } else if (next == 'shortbreak') {
            setTimeSeconds(300);
        }

        setTimerType(next);
    }

    const resetTimer = () => {
    
    }

    const toggleTimer = () => {
        setTimerRunning((timerRunning) => !timerRunning);
        if (intervalRef.current != null) {
            clearInterval(intervalRef.current);
            intervalRef.current = undefined;
        } else {
            intervalRef.current = setInterval(() => {
                setTimeSeconds((timeSeconds) => timeSeconds - 1);
            }, 10);
            console.log(typeof intervalRef.current)
        }
    }

    const skipTimer = () => {

    }

    return (
        <>
            <div className="flex gap-1">
                <button className="border border-black rounded p-2">Pomodoro</button>
                <button className="border border-black rounded p-2">Short Break</button>
                <button className="border border-black rounded p-2">Long Break</button>
            </div>

            <div className="border border-black w-full h-full">
                <p className="text-9xl p-5">{secondsToTimeString(timeSeconds)}</p>
            </div>

            <div className="flex gap-5">
                <button onClick={resetTimer} className="text-4xl"><PiArrowClockwiseBold /></button>
                <button onClick={toggleTimer} className="border border-black rounded text-4xl p-3">
                    {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={skipTimer} className="text-4xl"><IoMdSkipForward /></button>
            </div>
        </>
    );
}