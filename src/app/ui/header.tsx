import { FaGithub } from "react-icons/fa6";
import { HiCog } from "react-icons/hi";

export default function Header() {
    return (
        <div className="flex border border-violet-600 justify-center items-center p-2 bg-transparent">
            <div className="flex border border-violet-600 justify-between items-center w-96 gap-1">
                <div className="text-2xl flex-1">Pomodoro Timer</div>
                <button><FaGithub className="text-2xl" /></button>
                <button><HiCog className="text-3xl" /></button>
            </div>
        </div>
    );
}