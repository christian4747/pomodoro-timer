import { useState } from "react";
import { clamp } from "../lib/utils";
import clsx from "clsx";

interface Props {
    tasks: Array<{id: number, taskDesc: string, pomoCount: number, pomoLimit: number}>
    setTasks: React.Dispatch<React.SetStateAction<Array<{id: number, taskDesc: string, pomoCount: number, pomoLimit: number}>>>
    selectedTask: number
    setSelectedTask: React.Dispatch<React.SetStateAction<number>>
}

const min = 1;
const max = 999;

export default function Tasklist(props: Props) {

    const [newTask, setNewTask] = useState('');
    const [pomoLimit, setPomoLimit] = useState(1);
    const [idCount, setIdCount] = useState(1);

    const listItems = props.tasks.map((task, index) =>
    {
        if (task.id !== 0) {
            return(
                <li className="flex gap-2 items-center justify-between border border-black p-3" key={task.id}>
                    <div className={clsx(
                    {
                        'flex gap-2 truncate hover:text-clip hover:whitespace-normal w-2/3': task.pomoCount !== task.pomoLimit,
                        'flex gap-2 line-through truncate hover:text-clip hover:whitespace-normal w-2/3': task.pomoCount >= task.pomoLimit
                    }
                    )}
                    >
                        {task.taskDesc}
                    </div>
                    <div>
                        {task.pomoCount}/{task.pomoLimit}
                    </div>
                    <button onClick={() => selectElement(task.id)}>{props.selectedTask === task.id ? 'Unselect' : 'Select'}</button>
                    <button onClick={() => removeElement(task.id)}>&times;</button>
                </li>
            )
        }
    });

    const addTask = () => {
        setIdCount(prevState => prevState + 1);
        props.setTasks(prevState => [...props.tasks, {id: idCount, taskDesc: newTask, pomoCount: 0, pomoLimit: pomoLimit}]);
        setNewTask('');
        setPomoLimit(1);
    }

    const changeNewTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask(prevState => e.target.value);
    }

    const changePomoLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPomoLimit(prevState => clamp(parseInt(e.target.value), min, max));
    }

    const removeElement = (key: number) => {
        const newTasks = props.tasks.filter((task) => {
            return key !== task.id;
        });
        props.setTasks(newTasks);
    }

    const selectElement = (key: number) => {
        if (props.selectedTask === key) {
            props.setSelectedTask(0);
        } else {
            props.setSelectedTask(key);
        }
    }

    return (
        <div className="flex flex-col border border-indigo-600 h-72">
            <div className="text-3xl text-center">Today's Tasks</div>
            <ul className="flex flex-col p-5 gap-2 overflow-scroll overflow-x-hidden">
                {listItems}
                <div className="flex gap-2 items-center justify-between border border-black p-3">
                    <label>
                        <input className="w-40" type="text" value={newTask} onChange={changeNewTask} placeholder="Task description"/>
                    </label>
                    <label>
                        <input className="w-12" type="number" value={pomoLimit} onChange={changePomoLimit}/>
                    </label>
                    <button onClick={addTask}>Add a task...</button>
                </div>
            </ul>
        </div>
    );
}