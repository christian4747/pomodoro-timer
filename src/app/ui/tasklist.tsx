import { useEffect, useRef, useState } from "react";
import { clamp } from "../lib/utils";
import clsx from "clsx";
import { CheckboxSettingsInfo, Task, TaskList } from "../lib/types";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoIosRemove } from "react-icons/io";
import { GrRadial, GrRadialSelected } from "react-icons/gr";

interface Props {
    tasks: Array<Task>
    setTasks: React.Dispatch<React.SetStateAction<TaskList>>
    selectedTask: number
    setSelectedTask: React.Dispatch<React.SetStateAction<number>>
    checkboxSettings: CheckboxSettingsInfo
}

/** The lower limit of the task's current count */
const countMin = 0;
/** The lower limit of the task's goal count */
const limitMin = 1;
/** The maximum amount of pomodoros that can be assigned to a task */
const max = 999;

/**
 * A component that handles creating and showing added tasks.
 */
export default function Tasklist(props: Props) {

    // State for keeping track of the description input for adding a new task
    const [newTask, setNewTask] = useState('');
    // State for keeping track of the current pomodoro count for a task
    const [pomoCount, setPomoCount] = useState(0);
    // State for keeping track of the upper pomodoro limit for a task
    const [pomoLimit, setPomoLimit] = useState(1);
    // State for keeping tracking of keys assigned to tasks (incremented on new tasks)
    const [idCount, setIdCount] = useState(1);

    // Stores a reference for a boolean to prevent useEffect running on site load
    const isFirstExecution = useRef([true, true]);

    // Load stored task information
    useEffect(() => {
        const savedTasks = localStorage.getItem('savedTasks');
        if (savedTasks) {
            props.setTasks(JSON.parse(savedTasks));
        }

        const lastId = localStorage.getItem('taskIdCount');
        if (lastId) {
            setIdCount(JSON.parse(lastId));
        }

        const lastSelectedTask = localStorage.getItem('selectedTask');
        if (lastSelectedTask) {
            props.setSelectedTask(JSON.parse(lastSelectedTask));
        }
    }, []);

    // Save the current task ID count and the task list when tasks are modified
    useEffect(() => {
        if (isFirstExecution.current[0]) {
            isFirstExecution.current[0] = false;
            return;
        }

        localStorage.setItem('savedTasks', JSON.stringify(props.tasks));

        // Reset the id count if there are no more tasks so the number doesn't get very large
        if (props.tasks.length === 1) {
            localStorage.setItem('taskIdCount', JSON.stringify(1));
        } else {
            localStorage.setItem('taskIdCount', JSON.stringify(idCount));
        }
    }, [props.tasks]);

    // Save the currently selected task when the selected task is modified
    useEffect(() => {
        if (isFirstExecution.current[1]) {
            isFirstExecution.current[1] = false;
            return;
        }

        localStorage.setItem('selectedTask', JSON.stringify(props.selectedTask));
    }, [props.selectedTask]);

    // Creates the task list for display
    const listItems = props.tasks.map((task) =>
    {
        if (task.id !== 0) {
            if (task.editing) {
                return(
                    <li className={clsx(
                            {
                                "flex gap-2 border-b-2 border-black p-3 transition-[border-color] duration-1000" : true,
                                "border-white" : props.checkboxSettings.whiteText
                            }
                        )}
                        key={task.id}>
                        <button onClick={() => selectElement(task.id)}>{props.selectedTask === task.id ? <GrRadialSelected /> : <GrRadial />}</button>
                        <div className="flex gap-2 items-center justify-between">
                            <div>
                                <label>
                                    <input
                                        type="text"
                                        value={task.taskDesc}
                                        onChange={(e) => editTaskDescription(e, task.id)}
                                        className={clsx(
                                            {
                                                'flex gap-2 truncate hover:text-clip hover:whitespace-normal w-full bg-transparent border-b-2 border-black transition-[border-color] duration-1000': task.pomoCount !== task.pomoLimit,
                                                'flex gap-2 line-through truncate hover:text-clip hover:whitespace-normal w-full bg-transparent border-b-2 border-black transition-[border-color] duration-1000': task.pomoCount >= task.pomoLimit,
                                                'border-white': props.checkboxSettings.whiteText
                                            }
                                        )}
                                    />
                                </label>
                                
                            </div>
                            
                            <div>
                                <label>
                                    <input
                                        className={clsx({"w-12 bg-transparent border-b-2 border-black transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})}
                                        type="number"
                                        value={task.pomoCount}
                                        onChange={(e) => editCurrentPomoCount(e, task.id)}
                                    />
                                </label>
                            </div>
                            /
                            <div>
                                <label>
                                    <input
                                        className={clsx({"w-12 bg-transparent border-b-2 border-black transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})}
                                        type="number"
                                        value={task.pomoLimit}
                                        onChange={(e) => editPomoLimit(e, task.id)}
                                    />
                                </label>
                            </div>
                            <div className="flex w-11 justify-between">
                                <button onClick={() => editElement(task.id)}><FaSave /></button>
                                <button onClick={() => removeElement(task.id)}><IoIosRemove /></button>
                            </div>
                        </div>
                        
                    </li>
                )
            } else {
                return(
                    <li className={clsx({"flex gap-2 border-b-2 border-black p-3 transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})} key={task.id}>
                        <div className="flex gap-2 items-center justify-between w-full">
                            <button onClick={() => selectElement(task.id)}>{props.selectedTask === task.id ? <GrRadialSelected /> : <GrRadial />}</button>
                            <div className={clsx(
                                {
                                    'flex gap-2 truncate hover:text-clip hover:whitespace-normal w-full bg-transparent border-b-2 border-transparent': task.pomoCount !== task.pomoLimit,
                                    'flex gap-2 line-through truncate hover:text-clip hover:whitespace-normal w-full bg-transparent border-b-2 border-transparent': task.pomoCount >= task.pomoLimit
                                }
                            )}
                            >
                                {task.taskDesc}
                            </div>
                            <div>
                                {task.pomoCount}/{task.pomoLimit}
                            </div>
                            <button onClick={() => editElement(task.id)}><MdEdit /></button>
                            <button onClick={() => removeElement(task.id)}><IoIosRemove /></button>
                        </div>
                        
                    </li>
                )
            }
            
        }
    });

    /**
     * Adds a new task to the list of tasks and resets the input.
     */
    const addTask = () => {
        setIdCount(prevState => prevState + 1);
        props.setTasks(prevState => [...props.tasks, {id: idCount, taskDesc: '', pomoCount: 0, pomoLimit: 1, editing: true}]);
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
     * Changes the state of the number currently in the pomodoro count input box.
     * @param e event triggered by typing in the input box
     */
    const changePomoCount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPomoCount(prevState => clamp(parseInt(e.target.value), countMin, max));
    }

    /**
     * Changes the state of the number currently in the limit input box.
     * @param e event triggered by typing in the input box
     */
    const changePomoLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPomoLimit(prevState => clamp(parseInt(e.target.value), limitMin, max));
    }

    /**
     * Removes a task element by the given key.
     * @param key the task to remove
     */
    const removeElement = (key: number) => {
        const newTasks = props.tasks.filter((task) => {
            if (key !== task.id) {
                return true;
            } else {
                if (props.selectedTask === key) {
                    props.setSelectedTask(0);
                }
                return false;
            }
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

    /**
     * Edits the task description of the element with the given key.
     * @param e event triggered by typing in the input box
     * @param key the task to edit
     */
    const editTaskDescription = (e: React.ChangeEvent<HTMLInputElement>, key: number) => {
        const newTasks = props.tasks.map((task) => {
            if (task.id === key) {
                return {
                    ...task,
                    taskDesc: e.target.value
                };
            } else {
                return task;
            }
        });
        props.setTasks(newTasks);
    }

    /**
     * Edits the current pomodoro count of the element with the given key.
     * @param e event triggered by typing in the input box
     * @param key the task to edit
     */
    const editCurrentPomoCount = (e: React.ChangeEvent<HTMLInputElement>, key: number) => {
        const newTasks = props.tasks.map((task) => {
            if (task.id === key) {
                return {
                    ...task,
                    pomoCount: clamp(parseInt(e.target.value), countMin, max)
                };
            } else {
                return task;
            }
        });
        props.setTasks(newTasks);
    }

    /**
     * Edits the pomodoro count limit of the element with the given key.
     * @param e event triggered by typing in the input box
     * @param key the task to edit
     */
    const editPomoLimit = (e: React.ChangeEvent<HTMLInputElement>, key: number) => {
        const newTasks = props.tasks.map((task) => {
            if (task.id === key) {
                return {
                    ...task,
                    pomoLimit: clamp(parseInt(e.target.value), limitMin, max)
                };
            } else {
                return task;
            }
        });
        props.setTasks(newTasks);
    }

    /**
     * Toggles whether or not the given element is being edited.
     * @param key the task to toggle editing
     */
    const editElement = (key: number) => {
        const newTasks = props.tasks.map((task) => {
            if (task.id === key) {
                if (task.taskDesc.trim().length === 0) {
                    return task;
                } else {
                    return {
                        ...task,
                        editing: !task.editing
                    };
                }
            } else {
                return task;
            }
        });
        props.setTasks(newTasks);
    }

    return (
        <div className="flex flex-col">
            <div className="text-3xl text-center bg-transparent underline underline-offset-8">Today's Tasks</div>
            <ul className="flex flex-col p-5 gap-2 overflow-scroll overflow-x-hidden">
                {listItems}
                <div onClick={addTask} className={clsx({"flex gap-2 items-center justify-center border-2 border-black rounded-lg border-dashed p-3 cursor-pointer transition-[border-color] duration-1000" : true, 'border-white': props.checkboxSettings.whiteText})}>
                    <button>+ New Task</button>
                </div>
            </ul>
        </div>
    );
}