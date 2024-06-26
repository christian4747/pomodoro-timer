import { PiArrowClockwiseBold } from "react-icons/pi";
import { IoMdSkipForward } from "react-icons/io";
import { secondsToTimeString } from "../lib/utils";
import { useState, useEffect, useRef } from 'react';
import { CheckboxSettingsInfo, ColorInformation, TaskList, TimerInformation, TimerType, VolumeSettingsInfo } from "../lib/types";
import clsx from "clsx";

interface Props {
    timeSeconds: number
    setTimeSeconds: React.Dispatch<React.SetStateAction<number>>
    intervalRef: React.MutableRefObject<undefined | NodeJS.Timeout>
    timerType: TimerType
    setTimerType: React.Dispatch<React.SetStateAction<TimerType>>
    timerInfo: TimerInformation
    colorInfo: ColorInformation
    tasks: TaskList
    setTasks: React.Dispatch<TaskList>
    selectedTask: number
    setSelectedTask: React.Dispatch<React.SetStateAction<number>>
    volumeSettings: VolumeSettingsInfo
    ringAlarm: Function
    checkboxSettings: CheckboxSettingsInfo
}

/**
 * The component that handles the page's timer.
 */
export default function Timer(props: Props) {

    // State tracking whether or not the timer is running
    const [timerRunning, setTimerRunning] = useState(false);
    // State tracking the number of cycles the timer has performed
    const [cycleCount, setCycleCount] = useState(1);
    // State tracking the description of the current task
    const [taskDesc, setTaskDesc] = useState('');
    // Reference for the worker used for background timer ticking
    let worker = useRef<undefined | Worker>(undefined);

    // Stores a reference for a boolean to prevent useEffect running on site load
    const isFirstExecution = useRef([true]);

    // Set the settings based on saved preferences
    useEffect(() => {
        const storedCycleInfo = localStorage.getItem('cycleCount');
        if (storedCycleInfo) {
            setCycleCount(JSON.parse(storedCycleInfo));
        }
    }, []);

    // Save the cycle count on change
    useEffect(() => {
        if (isFirstExecution.current[0]) {
            isFirstExecution.current[0] = false;
            return;
        }

        localStorage.setItem('cycleCount', JSON.stringify(cycleCount));
    }, [cycleCount]);

    // Initializes the worker on page load
    useEffect(() => {
        worker.current = new Worker(new URL("../worker/worker.js", import.meta.url), { type: 'module' });

        worker.current.onmessage = (e) => {
            if (e.data[0] === 'currentSeconds') {
                props.setTimeSeconds(e.data[1]);
            }
        }
    }, []);

    // When the time elapsed changes, check whether the timer is finished and act accordingly
    useEffect(() => {
        if (isTimerFinished()) {
            if (worker.current != undefined) {
                worker.current.postMessage(['stoptimer']);
            }

            props.ringAlarm();

            clearInterval(props.intervalRef.current);
            props.intervalRef.current = undefined;
            setTimerRunning(false);
            configureTimer();
        }
    }, [props.timeSeconds]);

    // Handles changing the current task name under the number of cycles.
    useEffect(() => {
        if (props.selectedTask === 0) {
            setTaskDesc('');
        } else {
            props.tasks.map((task) => {
                if (task.id === props.selectedTask) {
                    setTaskDesc(task.taskDesc);
                }
            });
        }
        
    }, [props.selectedTask, props.tasks])

    /**
     * Returns true if the timer is finished, false otherwise.
     * @returns true if timer is finished, false otherwise
     */
    const isTimerFinished = () => {
        if (props.timerType === 'pomodoro') {
            return props.timeSeconds >= props.timerInfo.pomodoro;
        } else if (props.timerType === 'shortbreak') {
            return props.timeSeconds >= props.timerInfo.shortbreak;
        } else {
            return props.timeSeconds >= props.timerInfo.longbreak;
        }
    }

    /**
     * Returns the next TimerType after the given type.
     * @param currentType the current TimerType
     * @returns the next TimerType
     */
    const rotateType = (currentType : TimerType) => {
        if (currentType == 'pomodoro' && cycleCount % 4 === 0) {
            return 'longbreak';
        } else if (currentType == 'pomodoro') {
            return 'shortbreak';
        }
        return 'pomodoro';
    }

    /**
     * Sets up the timer for the next cycle.
     */
    const configureTimer = () => {
        // Get the next type, reset the timer, set to the next type
        let next: TimerType = rotateType(props.timerType);
        props.setTimeSeconds(0);
        props.setTimerType(next);

        // Increment the cycle count if a pomodoro has passed
        if (props.timerType === 'pomodoro') {
            setCycleCount((cycleCount) => cycleCount + 1);
            // If there is a selected task, increment the progress for that task
            if (props.selectedTask !== 0) {
                const newTasks = props.tasks.map((task) => {
                    if (task.id === props.selectedTask) {
                        return {
                            ...task,
                            pomoCount: task.pomoCount + 1
                        };
                    } else {
                        return task;
                    }
                });
                props.setTasks(newTasks);
            }
        }
    }

    /**
     * Implements the reset button functionality.
     * Stops the timer, interval, and resets elapsed seconds to 0.
     */
    const resetTimer = () => {
        if (worker.current != undefined) {
            worker.current.postMessage(['stoptimer']);
        }
        props.setTimeSeconds(0);
        clearInterval(props.intervalRef.current);
        props.intervalRef.current = undefined;
        setTimerRunning(false);
    }

    /**
     * Implements the 'Start' / 'Pause' button functionality.
     * Tells the worker to start or stop the timer.
     * If the worker is undefined, runs an internal timer.
     */
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

    /**
     * Implements the skip button functionality.
     * Tells the worker to stop the timer (if not undefined) and skips to the next TimerType.
     */
    const skipTimer = () => {
        if (worker.current != undefined) {
            worker.current.postMessage(['stoptimer']);
        }
        setTimerRunning(false);
        configureTimer();
    }

    /**
     * Implements the Pomodoro button.
     * Swaps the current TimerType to pomodoro.
     */
    const swapToPomodoro = () => {
        if (props.timerType !== 'pomodoro') {
            resetTimer();
            props.setTimerType('pomodoro');
        }
    }

    /**
     * Implements the Short Break button.
     * Swaps the current TimerType to shortbreak.
     */
    const swapToShortBreak = () => {
        if (props.timerType !== 'shortbreak') {
            resetTimer();
            props.setTimerType('shortbreak');
        }
    }

    /**
     * Implements the Long Break button.
     * Swaps the current TimerType to longbreak.
     */
    const swapToLongBreak = () => {
        if (props.timerType !== 'longbreak') {
            resetTimer();
            props.setTimerType('longbreak');
        }
    }

    /**
     * Sets the cycle count back to 1.
     */
    const resetCycleCount = () => {
        if (!confirm("Reset number of tomatoes?")) {
            return;
        }
        setCycleCount(1);
    }

    return (
        <>
            <div className="flex gap-1">
                <button 
                    className={clsx(
                    {
                        "border-b-4 border-black rounded p-2 transition-[border-color] duration-1000" : props.timerType === 'pomodoro',
                        "rounded p-2" : props.timerType !== 'pomodoro',
                        'border-white': props.checkboxSettings.whiteText,
                    })}
                    onClick={swapToPomodoro}
                >
                    Pomodoro
                </button>
                <button
                    className={clsx(
                    {
                        "border-b-4 border-black rounded p-2 transition-[border-color] duration-1000" : props.timerType === 'shortbreak',
                        "rounded p-2" : props.timerType !== 'shortbreak',
                        'border-white': props.checkboxSettings.whiteText
                    })} onClick={swapToShortBreak}
                >
                    Short Break
                </button>
                <button 
                    className={clsx(
                    {
                        "border-b-4 border-black rounded p-2 transition-[border-color] duration-1000" : props.timerType === 'longbreak',
                        "rounded p-2" : props.timerType !== 'longbreak',
                        'border-white': props.checkboxSettings.whiteText
                    })} 
                    onClick={swapToLongBreak}
                >
                    Long Break
                </button>
            </div>

            <div className="w-full h-full text-8xl p-5 text-center">
                {
                    props.timerType === 'pomodoro' ? secondsToTimeString(props.timerInfo.pomodoro - props.timeSeconds)
                    : props.timerType === 'shortbreak' ? secondsToTimeString(props.timerInfo.shortbreak - props.timeSeconds)
                    : secondsToTimeString(props.timerInfo.longbreak - props.timeSeconds)
                }
            </div>

            <div className="flex gap-5">
                <button onClick={resetTimer} className={clsx({"border-b-4 border-black text-4xl transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})}><PiArrowClockwiseBold /></button>
                <button onClick={toggleTimer} className={clsx({"border-b-4 border-black rounded text-4xl p-3 transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})}>
                    {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button onClick={skipTimer} className={clsx({"border-b-4 border-black text-4xl transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})}><IoMdSkipForward /></button>
            </div>

            <div className="cursor-pointer" onClick={resetCycleCount}>
                {cycleCount !== 1 ? props.timerType === 'pomodoro' ? '🍅x' + cycleCount : '🍅x' + (cycleCount - 1) : '🍅x' + cycleCount}
            </div>
            <div className="truncate w-3/4 h-1/4 text-center">
                {
                    props.timerType === 'shortbreak' || props.timerType === 'longbreak' ?'Time to relax!'
                    : props.selectedTask === 0 ? 'Work time!'
                    : taskDesc === '' ? 'Work time!'
                    : taskDesc
                }
            </div>
        </>
    );
}