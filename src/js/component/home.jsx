import React, { useState } from "react";
import { FaTrashArrowUp } from "react-icons/fa6";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && newTask.trim()) {
            setTasks([...tasks, { id: Date.now(), text: newTask.trim() }]);
            setNewTask('');
        }
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h1 className="text-center mb-4">Todo List</h1>
                            
                            <div className="mb-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Add a new task and press Enter"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>

                            <div className="todo-list">
                                {tasks.length === 0 ? (
                                    <p className="text-center text-muted">No tasks, add a task</p>
                                ) : (
                                    <ul className="list-group">
                                        {tasks.map(task => (
                                            <li
                                                key={task.id}
                                                className="list-group-item d-flex align-items-center position-relative"
                                            >
                                                <span className="flex-grow-1">{task.text}</span>
                                                <button
                                                    className="btn btn-link text-danger delete-icon position-absolute end-0"
                                                    onClick={() => deleteTask(task.id)}
                                                > 
                                                  <FaTrashArrowUp />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;