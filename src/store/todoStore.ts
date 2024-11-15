import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Status, TaskFilters, TaskSort } from '../types';

interface TodoStore {
  tasks: Task[];
  filters: TaskFilters;
  sort: TaskSort;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
  completeTask: (id: string) => void;
  uncompleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSort: (sort: Partial<TaskSort>) => void;
}

const initialFilters: TaskFilters = {
  search: '',
  tags: [],
  dateRange: {},
  priority: undefined,
};

const initialSort: TaskSort = {
  field: 'createdAt',
  direction: 'desc',
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      tasks: [],
      filters: initialFilters,
      sort: initialSort,
      
      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        }],
      })),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      })),

      moveTask: (id, status) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, status } : task
        ),
      })),

      completeTask: (id) => set((state) => {
        const tasks = state.tasks.map((task) => {
          if (task.id === id) {
            const completedTask = {
              ...task,
              status: 'done' as Status,
              completedAt: new Date(),
            };

            if (!task.isRecurring) {
              const timeout = window.setTimeout(() => {
                useTodoStore.getState().deleteTask(id);
              }, 10000);
              return { ...completedTask, deleteTimeout: timeout };
            }
            return completedTask;
          }
          return task;
        });
        return { tasks };
      }),

      uncompleteTask: (id) => set((state) => ({
        tasks: state.tasks.map((task) => {
          if (task.id === id) {
            if (task.deleteTimeout) {
              clearTimeout(task.deleteTimeout);
            }
            return {
              ...task,
              status: 'todo' as Status,
              completedAt: undefined,
              deleteTimeout: undefined,
            };
          }
          return task;
        }),
      })),

      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),

      setSort: (sort) => set((state) => ({
        sort: { ...state.sort, ...sort },
      })),
    }),
    {
      name: 'todo-storage',
    }
  )
);