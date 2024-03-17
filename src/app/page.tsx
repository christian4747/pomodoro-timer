'use client'

import Timer from './ui/timer';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Header from './ui/header';
import { secondsToTimeString } from './lib/utils';
import SettingsModal from './ui/settingsModal';

export default function Home() {

    const [timerInfo, setTimerInfo] = useState(
    {
        pomodoro: 1500,
        shortbreak: 300,
        longbreak: 900,
    });

    const [timerType, setTimerType] = useState('pomodoro');
    const [timeSeconds, setTimeSeconds] = useState(0); 
    const [showSettings, setShowSettings] = useState(false);
    const intervalRef = useRef<undefined | NodeJS.Timeout>(undefined);

    useEffect(() => {
        
    }, []);

    const handleClick = () => {
        setTimerInfo({
            pomodoro: 4000,
            shortbreak: 600,
            longbreak: 1800,
        });
    }
    
    return (
        <>
            <title>
                {
                    timerType === 'pomodoro' ? `${timerType} - ` + secondsToTimeString(timerInfo.pomodoro - timeSeconds)
                    : timerType === 'shortbreak' ? `${timerType} - ` + secondsToTimeString(timerInfo.shortbreak - timeSeconds)
                    : `${timerType} - ` + secondsToTimeString(timerInfo.longbreak - timeSeconds)
                }
            </title>
            <body className={clsx(
                {
                    'bg-red-100 transition duration-1500': timerType === 'pomodoro',
                    'bg-blue-100 transition duration-1500': timerType === 'shortbreak',
                    'bg-purple-100 transition duration-1500': timerType === 'longbreak',
                }
                )}>

                {/* Testing Modal */}
                <div>
                    <SettingsModal showSettings={showSettings} setShowSettings={setShowSettings}/>
                </div>

                <Header setShowSettings={setShowSettings}/>
                
                <main className="flex justify-center p-5 w-full">
                    <div className="flex flex-col">

                        {/* 1/2 */}
                        <div className="w-[450px] flex flex-col items-center justify-center border border-indigo-600 gap-2 p-2">
                            <Timer
                                timeSeconds={timeSeconds}
                                setTimeSeconds={setTimeSeconds}    
                                intervalRef={intervalRef}
                                timerType={timerType}
                                setTimerType={setTimerType}
                                timerInfo={timerInfo}
                            />
                        </div>

                        {/* 2/2 */}
                        <div className="flex flex-col items-center justify-center border border-indigo-600">
                            <div className="text-3xl">Today's Tasks</div>
                            <button onClick={handleClick}>123</button>
                            <ul>
                                <li>Task1 - 🍅x2</li>
                                <li>Task2 - 🍅x1</li>
                                <li>Task3 - 🍅x3</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </body>
        </>
    );
}
