'use client'

import Timer from './ui/timer';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Header from './ui/header';
import { secondsToTimeString } from './lib/utils';
import SettingsModal from './ui/settingsModal';
import Tasklist from './ui/tasklist';
import { ColorInformation, TaskList, TimerInformation, TimerType } from './lib/types';

/**
 * The home page for the pomodoro timer.
 */
export default function Home() {

    // Timer states
    // Default timer settings
    const [timerInfo, setTimerInfo] = useState<TimerInformation>(
    {
        pomodoro: 1500,
        shortbreak: 300,
        longbreak: 900,
    });
    // State for keeping track of the current timer type, starts at pomodoro
    const [timerType, setTimerType] = useState<TimerType>('pomodoro');
    // State for how many seconds have passed, starts at 0
    const [timeSeconds, setTimeSeconds] = useState(0); 

    // Settings states
    // Default color settings
    const [colorInfo, setColorInfo] = useState<ColorInformation>(
    {
        pomodoro: '#FECACA',
        shortbreak: '#BFDBFE',
        longbreak: '#E9D5FF'
    });
    // State for whether the settings tab is open, starts at false
    const [showSettings, setShowSettings] = useState(false);
    // State for tracking the current color of the page's background, starts at default pomodoro
    const [currentColor, setCurrentColor] = useState({ backgroundColor: colorInfo.pomodoro });
    // State for tracking whether or not white text is enabled, starts at false
    const [whiteText, setWhiteText] = useState(false);
    
    // Task states
    const [tasks, setTasks] = useState<TaskList>([{id: 0, taskDesc: '', pomoCount: 0, pomoLimit: 0, editing: false}]);
    const [selectedTask, setSelectedTask] = useState(0);
    
    // Reference for the interval used by the timer
    const intervalRef = useRef<undefined | NodeJS.Timeout>(undefined);

    // Effect to change the color whenever the timer type changes or the color is changed in the settings
    useEffect(() => {
        if (timerType === 'pomodoro') {
            setCurrentColor({ backgroundColor: colorInfo.pomodoro });
        } else if (timerType === 'shortbreak') {
            setCurrentColor({ backgroundColor: colorInfo.shortbreak });
        } else {
            setCurrentColor({ backgroundColor: colorInfo.longbreak });
        }
    }, [timerType, colorInfo]);

    // Automatically selects the next task when the current task is finished
    // TODO: add enable/disable checkbox in settings
    useEffect(() => {
        if (selectedTask === 0) {
            return;
        }

        let selectNext = false;
        tasks.map((task) => {
            if (task.id === selectedTask) {
                if (task.pomoCount === task.pomoLimit) {
                    selectNext = true;
                }
            } else if (selectNext) {
                setSelectedTask(task.id);
                selectNext = false;
            }
        });

        if (selectNext) {
            setSelectedTask(0);
        }
    }, [tasks]);
    
    return (
        <>
            <title>
                {
                    timerType === 'pomodoro' ? `${timerType} - ` + secondsToTimeString(timerInfo.pomodoro - timeSeconds)
                    : timerType === 'shortbreak' ? `${timerType} - ` + secondsToTimeString(timerInfo.shortbreak - timeSeconds)
                    : `${timerType} - ` + secondsToTimeString(timerInfo.longbreak - timeSeconds)
                }
            </title>
            <body style={currentColor} className={clsx(
                {
                    'bg-red-200 transition duration-1000': timerType === 'pomodoro',
                    'text-white bg-red-200 transition duration-1000': timerType === 'pomodoro' && whiteText,
                    'bg-blue-200 transition duration-1000': timerType === 'shortbreak',
                    'text-white bg-blue-200 transition duration-1000': timerType === 'shortbreak' && whiteText,
                    'bg-purple-200 transition duration-1000': timerType === 'longbreak',
                    'text-white bg-purple-200 transition duration-1000': timerType === 'longbreak' && whiteText,
                }
                )}>

                <SettingsModal
                    showSettings={showSettings}
                    setShowSettings={setShowSettings}
                    timerInfo={timerInfo}
                    setTimerInfo={setTimerInfo}
                    colorInfo={colorInfo}
                    setColorInfo={setColorInfo}
                    whiteText={whiteText}
                    setWhiteText={setWhiteText}
                />

                <Header setShowSettings={setShowSettings}/>
                
                <main className="flex justify-center p-5 w-full">
                    <div className="flex flex-col">

                        {/* 1/2 */}
                        <div className="w-[450px] flex flex-col items-center justify-center gap-2 p-2">
                            <Timer
                                timeSeconds={timeSeconds}
                                setTimeSeconds={setTimeSeconds}    
                                intervalRef={intervalRef}
                                timerType={timerType}
                                setTimerType={setTimerType}
                                timerInfo={timerInfo}
                                colorInfo={colorInfo}
                                tasks={tasks}
                                setTasks={setTasks}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                            />
                        </div>

                        {/* 2/2 */}
                        <div className="w-[450px]">
                            <Tasklist 
                                tasks={tasks}
                                setTasks={setTasks}
                                selectedTask={selectedTask}
                                setSelectedTask={setSelectedTask}
                            />
                        </div>
                    </div>
                </main>
            </body>
        </>
    );
}
