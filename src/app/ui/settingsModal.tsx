import clsx from "clsx";
import { clamp } from "../lib/utils";

interface Props {
    showSettings: boolean
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
    timerInfo: {pomodoro: number, shortbreak: number, longbreak: number}
    setTimerInfo: React.Dispatch<React.SetStateAction<{pomodoro: number; shortbreak: number; longbreak: number}>>
}

const min = 0;
const max = 999;

export default function SettingsModal(props: Props) {
    const showHide = () => {
        props.setShowSettings((prevState => !prevState));
    }

    const changePomodoro = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, pomodoro: clamp(parseInt(e.target.value), min, max) * 60});
    }

    const changeShortBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, shortbreak: clamp(parseInt(e.target.value), min, max) * 60});
    }
    
    const changeLongBreak = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.setTimerInfo({ ...props.timerInfo, longbreak: clamp(parseInt(e.target.value), min, max) * 60});
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
            <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-slate-200 -translate-x-1/2 -translate-y-1/2 p-5">
                <span className="float-right cursor-pointer" onClick={showHide}>&times;</span>
                <div className="flex flex-col gap-2">
                    <div className="text-2xl">Settings</div>
                    <label>
                        Pomodoro: <input type="number" name="pomodoro-length" value={props.timerInfo.pomodoro / 60} onChange={changePomodoro}/>
                    </label>
                    <label>
                        Short Break: <input type="number" name="pomodoro-length" value={props.timerInfo.shortbreak / 60} onChange={changeShortBreak}/>
                    </label>
                    <label>
                        Long Break: <input type="number" name="pomodoro-length" value={props.timerInfo.longbreak / 60} onChange={changeLongBreak}/>
                    </label>
                </div>
                <button className="absolute bottom-5 right-5 border border-indigo-600" onClick={showHide}>Save</button>
            </div>
        </div>
    );
}