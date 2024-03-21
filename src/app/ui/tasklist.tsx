import { useState } from "react";

interface Props {
    tasks: Array<string>
    setTasks: React.Dispatch<React.SetStateAction<Array<string>>>
}

export default function Tasklist(props: Props) {

    const [newTask, setNewTask] = useState('');

    const listItems = props.tasks.map(task => 
        <li>{task}</li>
    );

    const addTask = () => {
        props.setTasks(prevState => [...props.tasks, newTask]);
    }

    const changeNewTask = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask(prevState => e.target.value);
    }

    return (
        <div className="flex flex-col border border-indigo-600 h-60 overflow-scroll">
            <div className="text-3xl text-center">Today's Tasks</div>
            <ul>
                {listItems}
                <li>
                    <label>
                        <input type="text" value={newTask} onChange={changeNewTask}/>
                    </label>
                    <button onClick={addTask}>Add a task...</button></li>
            </ul>
        </div>
    );
}