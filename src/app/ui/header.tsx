import { FaGithub } from "react-icons/fa6";
import { HiCog } from "react-icons/hi";

interface Props {
    setShowSettings: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * The header used for the main page.
 */
export default function Header(props: Props) {

    /**
     * Toggles the visiblity of the settings modal.
     */
    const showHide = () => {
        props.setShowSettings((prevState => !prevState));
    }

    return (
        <div className="flex justify-center items-center p-2 bg-transparent">
            <div className="flex justify-between items-center w-96 gap-1 border-b-4 border-black">
                <div className="text-2xl flex-1">Pomodoro Timer</div>
                <button><FaGithub className="text-2xl" /></button>
                <button onClick={showHide}><HiCog className="text-3xl" /></button>
            </div>
        </div>
    );
}