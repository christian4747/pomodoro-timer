import clsx from "clsx";
import { clamp } from "../lib/utils";
import { CheckboxSettingsInfo, ColorInformation, TimerInformation, VolumeSettingsInfo } from "../lib/types";
import { useEffect, useRef } from "react";

interface Props {
    showSettings: boolean
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
    timerInfo: TimerInformation
    setTimerInfo: React.Dispatch<React.SetStateAction<TimerInformation>>
    colorInfo: ColorInformation
    setColorInfo: React.Dispatch<React.SetStateAction<ColorInformation>>
    checkboxSettings: CheckboxSettingsInfo
    setCheckboxSettings: React.Dispatch<React.SetStateAction<CheckboxSettingsInfo>>
    volumeSettings: VolumeSettingsInfo
    setVolumeSettings: React.Dispatch<React.SetStateAction<VolumeSettingsInfo>>
    ringAlarm: React.MouseEventHandler<HTMLButtonElement>
}

/** The minimum amount of minutes that can be assigned to a timer's length */
const timerMin = 0;
/** The maximum amount of minutes that can be assigned to a timer's length */
const timerMax = 999;

/** The minimum volume that can be assigned */
const volumeMin = 0;
/** The maximum volume that can be assigned */
const volumeMax = 100;

/**
 * The modal used to manage the settings for the page.
 */
export default function SettingsModal(props: Props) {

    // Stores a reference for a boolean to prevent useEffect running on site load
    const isFirstExecution = useRef([true, true, true, true]);

    // Set the settings based on saved preferences
    useEffect(() => {
        const storedTimerInfo = localStorage.getItem('timerPreference');
        if (storedTimerInfo) {
            props.setTimerInfo(JSON.parse(storedTimerInfo));
        }
        
        const storedCheckboxSettingsInfo = localStorage.getItem('checkboxSettingsPreference');
        if (storedCheckboxSettingsInfo) {
            props.setCheckboxSettings(JSON.parse(storedCheckboxSettingsInfo));
        }

        const storedColorInfo = localStorage.getItem('colorPreference');
        if (storedColorInfo) {
            props.setColorInfo(JSON.parse(storedColorInfo));
        }

        const storedVolumeInfo = localStorage.getItem('volumePreference');
        if (storedVolumeInfo) {
            props.setVolumeSettings(JSON.parse(storedVolumeInfo));
        }
    }, []);

    // Save the timer's length preference on change
    useEffect(() => {
        if (isFirstExecution.current[0]) {
            isFirstExecution.current[0] = false;
            return;
        }

        localStorage.setItem('timerPreference', JSON.stringify(props.timerInfo));
    }, [props.timerInfo]);

    // Save the checkbox settings preference on change
    useEffect(() => {
        if (isFirstExecution.current[1]) {
            isFirstExecution.current[1] = false;
            return;
        }

        localStorage.setItem('checkboxSettingsPreference', JSON.stringify(props.checkboxSettings));
    }, [props.checkboxSettings]);

    // Save the timer's color preference on change
    useEffect(() => {
        if (isFirstExecution.current[2]) {
            isFirstExecution.current[2] = false;
            return;
        }

        localStorage.setItem('colorPreference', JSON.stringify(props.colorInfo));
    }, [props.colorInfo]);

    // Save the alarm's volume preference on change
    useEffect(() => {
        if (isFirstExecution.current[3]) {
            isFirstExecution.current[3] = false;
            return;
        }

        localStorage.setItem('volumePreference', JSON.stringify(props.volumeSettings));
    }, [props.volumeSettings]);

    /**
     * Resets the settings to default.
     */
    const resetSettings = () => {
        if (!confirm('Reset settings to default?')) {
            return;
        }

        localStorage.clear();

        props.setTimerInfo({
            pomodoro: 1500,
            shortbreak: 300,
            longbreak: 900,
        });

        props.setCheckboxSettings({
            whiteText: false,
            autoSelectNext: false,
            autoDeselectFinished: false,
        });
        
        props.setColorInfo({
            pomodoro: '#D291BC',
            shortbreak: '#E0BBE4',
            longbreak: '#FEC8D8',
        });

        props.setVolumeSettings({
            alarmSound: 20,
        });
    }

    /**
     * Toggles the visiblity of the settings modal.
     */
    const showHide = () => {
        props.setShowSettings((prevState => !prevState));
    }

    /**
     * Changes the current value of the pomodoro timer's length.
     * @param e event triggered by typing in the input box
     */
    const changePomodoro = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, pomodoro: clamp(parseInt(e.target.value), timerMin, timerMax) * 60});
    }

    /**
     * Changes the current value of the short break timer's length.
     * @param e event triggered by typing in the input box
     */
    const changeShortBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, shortbreak: clamp(parseInt(e.target.value), timerMin, timerMax) * 60});
    }
    
    /**
     * Changes the current value of the long break timer's length.
     * @param e event triggered by typing in the input box
     */
    const changeLongBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, longbreak: clamp(parseInt(e.target.value), timerMin, timerMax) * 60});
    }

    /**
     * Changes the current value of the pomodoro timer's color.
     * @param e event triggered by typing in the input box
     */
    const changePomodoroColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setColorInfo({ ...props.colorInfo, pomodoro: e.target.value});
    }

    /**
     * Changes the current value of the short break timer's color.
     * @param e event triggered by typing in the input box
     */
    const changeShortBreakColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setColorInfo({ ...props.colorInfo, shortbreak: e.target.value});
    }

    /**
     * Changes the current value of the long break timer's color.
     * @param e event triggered by typing in the input box
     */
    const changeLongBreakColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setColorInfo({ ...props.colorInfo, longbreak: e.target.value});
    }

    /**
     * Changes the current value of the alarm's volume.
     * @param e event triggered by typing in the input box
     */
    const changeVolumeAlarm = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setVolumeSettings({...props.volumeSettings, alarmSound: clamp(parseInt(e.target.value), volumeMin, volumeMax)})
    }

    /**
     * Toggles whether the page uses white text.
     */
    const toggleWhiteText = () => {
        props.setCheckboxSettings({...props.checkboxSettings, whiteText: !props.checkboxSettings.whiteText});
    }

    /**
     * Toggles whether the next task on the list will be automatically selected once the previous one is completed.
     */
    const toggleAutoSelectNext = () => {
        props.setCheckboxSettings({...props.checkboxSettings, autoSelectNext: !props.checkboxSettings.autoSelectNext});
    }

    /**
     * Toggles whether the current task will be deselected when completed.
     */
    const toggleAutoDeselectFinished = () => {
        props.setCheckboxSettings({...props.checkboxSettings, autoDeselectFinished: !props.checkboxSettings.autoDeselectFinished});
    }

    return (
        // Modal container
        <div className={clsx(
            {
                "": props.showSettings,
                "hidden": !props.showSettings
            }
        )}>

            <div onClick={showHide} className="fixed z-1 bg-black/40 w-full h-full"></div>
            {/* Modal content */}
            <div className={clsx(
                {
                    "z-2 fixed top-1/2 left-1/2 w-96 bg-slate-200 -translate-x-1/2 -translate-y-1/2 p-5 overflow-auto rounded": !props.checkboxSettings.whiteText,
                    "z-2 fixed top-1/2 left-1/2 w-96 bg-slate-500 -translate-x-1/2 -translate-y-1/2 p-5 overflow-auto rounded": props.checkboxSettings.whiteText,
                }
            )}>
                <div className="flex flex-col gap-2 w-full">
                    <div className="flex align-center justify-between">
                        <div className="text-3xl">Settings</div>
                        <div className="cursor-pointer" onClick={showHide}>&times;</div>
                    </div>

                    <div className="text-2xl">Audio Options</div>
                    <div className="flex align-center gap-2 justify-between w-full">
                        Alarm Sound:
                        <input
                            className="bg-transparent border border-gray-400 w-1/4"
                            type="range"
                            min="0"
                            max="100"
                            name="alarm-volume"
                            value={props.volumeSettings.alarmSound}
                            onChange={changeVolumeAlarm}
                        />
                        <div className="flex align-center gap-2 justify-center items-center w-1/4">
                            <div>
                                <input
                                    className="bg-transparent border border-gray-400 w-12"
                                    type="number"
                                    name="alarm-volume-box"
                                    value={props.volumeSettings.alarmSound}
                                    onChange={changeVolumeAlarm}
                                />
                            </div>
                            <button onClick={props.ringAlarm}>Test</button>
                        </div>
                    </div>

                    <div className="text-2xl">Timer Lengths</div>
                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Pomodoro:
                            <input
                                className="bg-transparent border border-gray-400 w-12"
                                type="number" name="pomodoro-length"
                                value={props.timerInfo.pomodoro / 60}
                                onChange={changePomodoro}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Short Break:
                            <input
                                className="bg-transparent border border-gray-400 w-12"
                                type="number"
                                name="shortbreak-length"
                                value={props.timerInfo.shortbreak / 60}
                                onChange={changeShortBreak}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Long Break:
                            <input
                                className="bg-transparent border border-gray-400 w-12"
                                type="number"
                                name="longbreak-length"
                                value={props.timerInfo.longbreak / 60}
                                onChange={changeLongBreak}
                            />
                        </div>
                    </div>

                    <div className="text-2xl">Color Options</div>
                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Pomodoro:
                            <input
                                className="bg-transparent w-12"
                                type="color"
                                name="pomodoro-color"
                                value={props.colorInfo.pomodoro}
                                onChange={changePomodoroColor}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Short Break:
                            <input
                                className="bg-transparent w-12"
                                type="color"
                                name="shortbreak-color"
                                value={props.colorInfo.shortbreak}
                                onChange={changeShortBreakColor}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Long Break:
                            <input
                                className="bg-transparent w-12"
                                type="color"
                                name="longbreak-color"
                                value={props.colorInfo.longbreak}
                                onChange={changeLongBreakColor}
                            />
                        </div>
                    </div>

                    <div className="text-2xl">Other Options</div>                    
                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            White Text:
                            <input
                                type="checkbox"
                                name="longbreak-color"
                                checked={props.checkboxSettings.whiteText}
                                onChange={toggleWhiteText}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Auto-Select Next Task:
                            <input
                                type="checkbox"
                                name="longbreak-color"
                                checked={props.checkboxSettings.autoSelectNext}
                                onChange={toggleAutoSelectNext}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex align-center gap-2 justify-between w-full">
                            Auto-Deselect Finished Tasks:
                            <input
                                type="checkbox"
                                name="longbreak-color"
                                checked={props.checkboxSettings.autoDeselectFinished}
                                onChange={toggleAutoDeselectFinished}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button className="text-xl" onClick={resetSettings}>Reset to Default</button>
                    </div>
                    
                </div>
                
            </div>
        </div>
    );
}