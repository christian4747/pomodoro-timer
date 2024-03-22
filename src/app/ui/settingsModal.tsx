import clsx from "clsx";
import { clamp } from "../lib/utils";
import { ColorInformation, TimerInformation } from "../lib/types";

interface Props {
    showSettings: boolean
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
    timerInfo: TimerInformation
    setTimerInfo: React.Dispatch<React.SetStateAction<TimerInformation>>
    colorInfo: ColorInformation
    setColorInfo: React.Dispatch<React.SetStateAction<ColorInformation>>
    whiteText: boolean
    setWhiteText: React.Dispatch<React.SetStateAction<boolean>>
}

/** The minimum amount of minutes that can be assigned to a timer's length */
const min = 0;
/** The maximum amount of minutes that can be assigned to a timer's length */
const max = 999;

/**
 * The modal used to manage the settings for the page.
 */
export default function SettingsModal(props: Props) {

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
        props.setTimerInfo({ ...props.timerInfo, pomodoro: clamp(parseInt(e.target.value), min, max) * 60});
    }

    /**
     * Changes the current value of the short break timer's length.
     * @param e event triggered by typing in the input box
     */
    const changeShortBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, shortbreak: clamp(parseInt(e.target.value), min, max) * 60});
    }
    
    /**
     * Changes the current value of the long break timer's length.
     * @param e event triggered by typing in the input box
     */
    const changeLongBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, longbreak: clamp(parseInt(e.target.value), min, max) * 60});
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
     * Toggles whether the page uses white text.
     */
    const toggleWhiteText = () => {
        props.setWhiteText(prevState => !prevState);
    }

    return (
        // Modal container
        <div className={clsx(
            {
                "fixed z-1 bg-black/40 w-full h-full": props.showSettings,
                "hidden fixed z-1 bg-black/40 w-full h-full": !props.showSettings
            }
        )}>
            {/* Modal content */}
            <div className={clsx(
                {
                    "fixed top-1/2 left-1/2 w-96 h-96 bg-slate-200 -translate-x-1/2 -translate-y-1/2 p-5": !props.whiteText,
                    "fixed top-1/2 left-1/2 w-96 h-96 bg-slate-500 -translate-x-1/2 -translate-y-1/2 p-5": props.whiteText,
                }
            )}>
                <span className="float-right cursor-pointer" onClick={showHide}>&times;</span>
                <div className="flex flex-col gap-2">
                    <div className="text-3xl">Settings</div>

                    <div className="text-2xl">Timer Lengths</div>
                    <div>
                        <label>
                            Pomodoro: <input className="bg-slate-400 w-12" type="number" name="pomodoro-length" value={props.timerInfo.pomodoro / 60} onChange={changePomodoro}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Short Break: <input className="bg-slate-400 w-12" type="number" name="shortbreak-length" value={props.timerInfo.shortbreak / 60} onChange={changeShortBreak}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Long Break: <input className="bg-slate-400 w-12" type="number" name="longbreak-length" value={props.timerInfo.longbreak / 60} onChange={changeLongBreak}/>
                        </label>
                    </div>

                    <div className="text-2xl">Color Options</div>
                    <div>
                        <label>
                            Pomodoro: <input className="bg-slate-400 w-12" type="color" name="pomodoro-color" value={props.colorInfo.pomodoro} onChange={changePomodoroColor}/>
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            Short Break: <input className="bg-slate-400 w-12" type="color" name="shortbreak-color" value={props.colorInfo.shortbreak} onChange={changeShortBreakColor}/>
                        </label>
                    </div>

                    <div>
                        <label>
                            Long Break: <input className="bg-slate-400 w-12" type="color" name="longbreak-color" value={props.colorInfo.longbreak} onChange={changeLongBreakColor}/>
                        </label>
                    </div>
                    
                    <div>
                        <label>
                            White Text: <input type="checkbox" name="longbreak-color" defaultChecked={props.whiteText} onChange={toggleWhiteText}/>
                        </label>
                    </div>
                    
                </div>
                <button className="absolute bottom-5 right-5 border border-indigo-600" onClick={showHide}>Save</button>
            </div>
        </div>
    );
}