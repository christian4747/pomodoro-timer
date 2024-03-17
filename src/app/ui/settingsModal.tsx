import clsx from "clsx";
import { useState } from "react";

interface Props {
    showSettings: boolean
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SettingsModal(props: Props) {

    const showHide = () => {
        props.setShowSettings((prevState => !prevState));
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
                <div>Welcome to the settings</div>
                <div className="flex flex-col gap-2">
                    <label>
                        Pomodoro: <input name="pomodoro-length"/>
                    </label>
                    <label>
                        Short Break: <input name="pomodoro-length"/>
                    </label>
                    <label>
                        Long Break: <input name="pomodoro-length"/>
                    </label>
                </div>
                <button className="absolute bottom-5 right-5 border border-indigo-600" onClick={showHide}>Save</button>
            </div>
        </div>
    );
}