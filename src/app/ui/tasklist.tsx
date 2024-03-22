import { useState } from "react";
import { clamp } from "../lib/utils";
import clsx from "clsx";

interface Props {
    tasks: Array<{id: number, taskDesc: string, pomoCount: number, pomoLimit: number}>
    setTasks: React.Dispatch<React.SetStateAction<Array<{id: number, taskDesc: string, pomoCount: number, pomoLimit: number}>>>
    selectedTask: number
    setSelectedTask: React.Dispatch<React.SetStateAction<number>>
}

/** The minimum amount of pomodoros that can be assigned to a task */
const min = 1;
/** The maximum amount of pomodoros that can be assigned to a task */
const max = 999;

/**
 * A component that handles creating and showing added tasks.
 */
export default function Tasklist(props: Props) {

    // State for keeping track of the description input for adding a new task
    const [newTask, setNewTask] = useState('');
    // State for keeping track of the upper pomodoro limit for a task
    const [pomoLimit, setPomoLimit] = useState(1);
    // State for keeping tracking of keys assigned to tasks (incremented on new tasks)
    const [idCount, setIdCount] = useState(1);

    // Creates the task list for display
    const listItems = props.tasks.map((task) =>
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

    /**
     * Adds a new task to the list of tasks and resets the input.
     */
    const addTask = () => {
        setIdCount(prevState => prevState + 1);
        props.setTasks(prevState => [...props.tasks, {id: idCount, taskDesc: newTask, pomoCount: 0, pomoLimit: pomoLimit}]);
        setNewTask('');
        setPomoLimit(1);
    }

    /**
     * Changes the state of the text currently in the description input box.
     * @param e event triggered by typing in the input box
     */
    const changeNewTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask(prevState => e.target.value);
    }

    /**
     * Changes the state of the number currently in the limit input box.
     * @param e event triggered by typing in the input box
     */
    const changePomoLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPomoLimit(prevState => clamp(parseInt(e.target.value), min, max));
    }

    /**
     * Removes a task element by the given key.
     * @param key the task to remove
     */
    const removeElement = (key: number) => {
        const newTasks = props.tasks.filter((task) => {
            return key !== task.id;
        });
        props.setTasks(newTasks);
    }

    /**
     * Selects a task element by the given key.
     * @param key the task to select
     */
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
                    <button onClick={addTask}>Add task</button>
                </div>
            </ul>
        </div>
    );
}