import React, { useState, useEffect } from "react";
import { FaTrashArrowUp } from "react-icons/fa6";

const API_BASE_URL = "https://playground.4geeks.com/todo";
const USER_NAME = "cam123";

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USER_NAME}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            console.log("Fetched todos:", data);
            setTasks(data);
            setLoading(false);
        } catch (error) {
            console.error("Fetch error:", error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAddTask = async (e) => {
        if (e.key === 'Enter' && newTask.trim()) {
            try {
                const todo = {
                    label: newTask.trim(),
                    done: false
                };

                const response = await fetch(`${API_BASE_URL}/todos/${USER_NAME}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(todo)
                });

                if (!response.ok) {
                    throw new Error('Failed to add task');
                }

                // Important: Fetch the updated list after adding a task
                setNewTask(''); // Clear input first
                await fetchTodos(); // Then refresh the list
            } catch (error) {
                console.error("Error adding task:", error);
                setError(error.message);
            }
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            // Fetch the updated list after deleting
            await fetchTodos();
        } catch (error) {
            console.error("Delete task error:", error);
            setError(error.message);
        }
    };

    const clearAllTasks = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USER_NAME}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to clear tasks');
            }

            setTasks([]); // Clear local state
            await fetchTodos(); // Refresh from server
        } catch (error) {
            console.error("Clear tasks error:", error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">Error: {error}</div>;
    }

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
                                    onKeyDown={handleAddTask}
                                />
                            </div>

                            <div className="todo-list">
                                {!Array.isArray(tasks) || tasks.length === 0 ? (
                                    <p className="text-center text-muted">No tasks, add a task</p>
                                ) : (
                                    <>
                                        <ul className="list-group mb-3">
                                            {tasks.map((task, index) => (
                                                <li
                                                    key={index}
                                                    className="list-group-item d-flex align-items-center justify-content-between"
                                                >
                                                    <span>{task.label}</span>
                                                    <button
                                                        className="btn btn-link text-danger"
                                                        onClick={() => deleteTask(task.id)}
                                                    >
                                                        <FaTrashArrowUp />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="task-count text-muted mb-3">
                                            Total tasks: {tasks.length}
                                        </div>
                                        <button
                                            className="btn btn-danger w-100"
                                            onClick={clearAllTasks}
                                        >
                                            Clear All Tasks
                                        </button>
                                    </>
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