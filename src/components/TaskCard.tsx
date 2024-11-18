import React, {useState, useEffect} from 'react';
import {useDrag} from 'react-dnd';
import {format} from 'date-fns';
import {Task, Priority} from '../types';
import {useTodoStore} from '../store/todoStore';
import {Tag, Calendar, Clock, RotateCcw, Trash2, CheckCircle, XCircle, Edit2, Save, X} from 'lucide-react';

interface TaskCardProps {
    task: Task;
}

export function TaskCard({task}: TaskCardProps) {
    const {deleteTask, completeTask, incompleteTask, updateTask} = useTodoStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description || '');
    const [editedDueDate, setEditedDueDate] = useState(
        task.dueDate ? format(task.dueDate, "yyyy-MM-dd'T'HH:mm") : ''
    );
    const [editedPriority, setEditedPriority] = useState<Priority>(task.priority);
    const [editedTags, setEditedTags] = useState<string[]>(task.tags);
    const [editedIsRecurring, setEditedIsRecurring] = useState(task.isRecurring);
    const [editedRecurringDays, setEditedRecurringDays] = useState(Math.floor((task.recurringInterval || 0) / (24 * 60)));
    const [editedRecurringHours, setEditedRecurringHours] = useState(Math.floor(((task.recurringInterval || 0) % (24 * 60)) / 60));
    const [editedRecurringMinutes, setEditedRecurringMinutes] = useState((task.recurringInterval || 0) % 60);
    const [tagInput, setTagInput] = useState('');
    const [countdown, setCountdown] = useState(10);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'TASK',
        item: {id: task.id},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (task.completedAt && !task.isRecurring) {
            setCountdown(10);
            timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        deleteTask(task.id);
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [task.completedAt, task.isRecurring, task.id, deleteTask]);

    const handleSave = () => {
        const totalMinutes = editedRecurringDays * 24 * 60 + editedRecurringHours * 60 + editedRecurringMinutes;
        updateTask(task.id, {
            title: editedTitle,
            description: editedDescription,
            dueDate: editedDueDate ? new Date(editedDueDate) : undefined,
            priority: editedPriority,
            tags: editedTags,
            isRecurring: editedIsRecurring,
            recurringInterval: editedIsRecurring ? totalMinutes : undefined,
        });
        setIsEditing(false);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            setEditedTags([...editedTags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const priorityColors = {
        low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    if (isEditing) {
        return (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        placeholder="Task title"
                    />

                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        placeholder="Description"
                        rows={2}
                    />

                    <input
                        type="datetime-local"
                        value={editedDueDate}
                        onChange={(e) => setEditedDueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark]"
                    />

                    <select
                        value={editedPriority}
                        onChange={(e) => setEditedPriority(e.target.value as Priority)}
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={editedIsRecurring}
                            onChange={(e) => setEditedIsRecurring(e.target.checked)}
                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Recurring Task</label>
                    </div>

                    {editedIsRecurring && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Repeat every
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editedRecurringDays || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setEditedRecurringDays(value === '' ? 0 : Math.max(0, parseInt(value)));
                                        }}
                                        placeholder="0"
                                        className="h-10 pl-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Days</label>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max="23"
                                        value={editedRecurringHours || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setEditedRecurringHours(value === '' ? 0 : Math.min(23, Math.max(0, parseInt(value))));
                                        }}
                                        placeholder="0"
                                        className="h-10 pl-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Hours</label>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        min="0"
                                        max="59"
                                        value={editedRecurringMinutes || ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setEditedRecurringMinutes(value === '' ? 0 : Math.min(59, Math.max(0, parseInt(value))));
                                        }}
                                        placeholder="0"
                                        className="h-10 pl-2 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
                                    />
                                    <label className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Minutes</label>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {editedTags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm flex items-center"
                                >
                  {tag}
                                    <button
                                        onClick={() => setEditedTags(editedTags.filter((_, i) => i !== index))}
                                        className="ml-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                    >
                    <X className="w-4 h-4"/>
                  </button>
                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add tags (press Enter)"
                            className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md"
                        >
                            <Save className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={drag}
            className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md ${
                isDragging ? 'opacity-50' : ''
            } ${task.completedAt ? 'border-l-4 border-green-500' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">{task.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
            </div>

            {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
            )}

            <div className="space-y-2">
                {task.dueDate && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-red-500 dark:text-red-400"/>
                        {format(task.dueDate, 'PPP')}
                    </div>
                )}

                {task.isRecurring && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <RotateCcw className="w-4 h-4 mr-2"/>
                        Repeats every{' '}
                        {task.recurringInterval && (
                            <>
                                {Math.floor(task.recurringInterval / (24 * 60)) > 0 && 
                                    `${Math.floor(task.recurringInterval / (24 * 60))} days `}
                                {Math.floor((task.recurringInterval % (24 * 60)) / 60) > 0 &&
                                    `${Math.floor((task.recurringInterval % (24 * 60)) / 60)} hours `}
                                {task.recurringInterval % 60 > 0 && 
                                    `${task.recurringInterval % 60} minutes`}
                            </>
                        )}
                    </div>
                )}

                {task.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                        <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
                                >
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {task.completedAt && !task.isRecurring && (
                <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2"/>
                    Deleting in {countdown}s...
                </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                >
                    <Edit2 className="w-5 h-5"/>
                </button>
                {task.status !== 'done' ? (
                    <button
                        onClick={() => completeTask(task.id)}
                        className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                    >
                        <CheckCircle className="w-5 h-5"/>
                    </button>
                ) : (
                    <button
                        onClick={() => incompleteTask(task.id)}
                        className="p-1 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded"
                    >
                        <XCircle className="w-5 h-5"/>
                    </button>
                )}
                <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                >
                    <Trash2 className="w-5 h-5"/>
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Delete Task
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteTask(task.id);
                                    setShowDeleteConfirm(false);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}