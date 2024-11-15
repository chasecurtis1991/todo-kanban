import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { KanbanColumn } from './components/KanbanColumn';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskFilters } from './components/TaskFilters';
import { TaskSort } from './components/TaskSort';
import { ThemeToggle } from './components/ThemeToggle';
import { useTodoStore } from './store/todoStore';
import { ClipboardList } from 'lucide-react';
import { useFilteredTasks } from './hooks/useFilteredTasks';

function App() {
  const { tasks, filters, sort } = useTodoStore();

  const todoTasks = useFilteredTasks(tasks, filters, sort, 'todo');
  const inProgressTasks = useFilteredTasks(tasks, filters, sort, 'in-progress');
  const doneTasks = useFilteredTasks(tasks, filters, sort, 'done');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClipboardList className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Task Manager
                </h1>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-3 space-y-4">
              <TaskFilters />
            </div>
            
            <div className="col-span-12 lg:col-span-9 space-y-4">
              <TaskSort />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KanbanColumn status="todo" tasks={todoTasks} />
                <KanbanColumn status="in-progress" tasks={inProgressTasks} />
                <KanbanColumn status="done" tasks={doneTasks} />
              </div>
            </div>
          </div>
        </main>

        <AddTaskForm />
      </div>
    </DndProvider>
  );
}

export default App;