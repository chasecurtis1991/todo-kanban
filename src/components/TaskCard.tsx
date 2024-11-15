import React, {useState} from 'react';
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
    const [tagInput, setTagInput] = useState('');

    const [{isDragging}, drag] = useDrag(() => ({
        type: 'TASK',
        item: {id: task.id},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const handleSave = () => {
        updateTask(task.id, {
            title: editedTitle,
            description: editedDescription,
            dueDate: editedDueDate ? new Date(editedDueDate) : undefined,
            priority: editedPriority,
            tags: editedTags,
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
                        className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
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
                        Every {task.recurringInterval} days
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
                    Deleting in 10s...
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
                    onClick={() => deleteTask(task.id)}
                    className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                >
                    <Trash2 className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
}