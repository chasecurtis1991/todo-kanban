import {useDrop} from 'react-dnd';
import {Status, Task} from '../types';
import {TaskCard} from './TaskCard';
import {useTodoStore} from '../store/todoStore';

interface KanbanColumnProps {
    status: Status;
    tasks: Task[];
}

const statusConfig = {
    todo: {title: 'To Do', bgColor: 'bg-yellow-100 dark:bg-yellow-900'},
    'in-progress': {title: 'In Progress', bgColor: 'bg-blue-100 dark:bg-blue-900'},
    done: {title: 'Done', bgColor: 'bg-green-100 dark:bg-green-900'},
};

export function KanbanColumn({status, tasks}: KanbanColumnProps) {
    const {moveTask} = useTodoStore();
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'TASK',
        drop: (item: { id: string }) => {
            moveTask(item.id, status);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            className={`flex-1 min-h-[600px] ${
                statusConfig[status].bgColor
            } p-4 rounded-lg ${isOver ? 'ring-2 ring-blue-400' : ''}`}
        >
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-300">{statusConfig[status].title}</h2>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task}/>
                ))}
            </div>
        </div>
    );
}