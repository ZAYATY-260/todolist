'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Moon, Sun, SearchIcon, Trash2 } from "lucide-react";
import Image from 'next/image';

const Page = () => {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [formVisible, setFormVisible] = useState(false);

    const [tasks, setTasks] = useState<{ id: number; title: string;  status: boolean }[]>([]);
    const [title, setTitle] = useState("");
    const [status, setstatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filter tasks by title or description
    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    const addTask = () => {
        if (!title.trim()) return;
        setTasks([...tasks, { id: Date.now(), title, status: false }]);
        setTitle("");
        setstatus("");
        setFormVisible(false);
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <div className="flex flex-col items-center px-4 py-12 min-h-screen">
            {/* Title */}
            <h1 className="text-3xl font-extralight mb-6 text-center">TODO LIST</h1>

            {/* Search + Filter + Theme */}
            <div className="w-full lg:px-40  flex lg:flex-row flex-col gap-4 items-center justify-center mb-8">
                <div className="relative w-full">
                    <input
                        name='search'
                        id='search'
                        type="search"
                        placeholder="Search tasks..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4  py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <SearchIcon
                        size={20}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                </div>

                <button
                    id="Theme-mode"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="px-3 py-2 rounded-md border border-gray-300"
                >
                    {theme === "light" ? <Moon /> : <Sun />}
                </button>
            </div>

            {/* Task Cards */}
            <div className="grid gap-4 w-full max-w-3xl">
                {filteredTasks.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center justify-center">
                        <Image src="/empty.png" alt="empty" height={174} width={210} />
                        <p className="text-gray-400 mt-4">No tasks found</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (

                        <div
                            key={task.id}
                            className="rounded-lg shadow-md p-4 flex justify-between items-center "
                        >

                            <input

                                type="checkbox"
                                checked={task.status} // true or false
                                onChange={() =>
                                    setTasks(
                                        tasks.map((t) =>
                                            t.id === task.id ? { ...t, status: !t.status } : t
                                        )
                                    )
                                }
                            />


                            <div>
                                <h2 className={`text-lg font-semibold ${task.status ? "line-through text-gray-400" : ""
                                    }`}>{task.title}</h2>
                            </div>
                            <p
                                className="text-gray-400 hover:text-red-700 cursor-pointer"
                                onClick={() => setTasks(tasks.filter((t) => t.id !== task.id))}
                            >
                                <Trash2 size={15} />
                            </p>
                        </div>
                    ))
                )}
            </div>


            {/* Floating Button */}
            <div className="fixed bottom-10 right-12">
                <button
                    className="px-3 py-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
                    onClick={() => setFormVisible(true)}
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Modal */}
            {formVisible && (
                <div
                    id="TodoForm"
                    className="absolute z-50 top-0 left-0 w-full h-full backdrop-blur-sm bg-opacity-40 flex items-center justify-center"
                    onClick={() => setFormVisible(false)} // close when clicking the overlay
                >
                    <div
                        className="rounded-md shadow-lg bg-white p-6 w-96 task-form"
                        onClick={(e) => e.stopPropagation()} // stop closing when clicking inside
                    >
                        {/* Header */}
                        <div className="flex justify-center items-center mb-4">
                            <h1 className="text-xl font-semibold">New Task</h1>
                        </div>

                        {/* Form Body */}
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between gap-3 mt-6">
                            <button
                                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                                onClick={() => setFormVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                onClick={addTask}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default Page
