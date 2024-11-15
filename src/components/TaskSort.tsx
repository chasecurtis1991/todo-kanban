import { ArrowUpDown } from 'lucide-react';
import { useTodoStore } from '../store/todoStore';
import { SortField, SortDirection } from '../types';

export function TaskSort() {
  const { sort, setSort } = useTodoStore();

  const fields: { value: SortField; label: string }[] = [
    { value: 'title', label: 'Title' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'createdAt', label: 'Created Date' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm dark:text-gray-300">
      <ArrowUpDown className="w-5 h-5 text-gray-400" />
      <select
        value={sort.field}
        onChange={(e) => setSort({ field: e.target.value as SortField })}
        className="h-8 rounded-md border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-sm p-1.5"
      >
        {fields.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        value={sort.direction}
        onChange={(e) => setSort({ direction: e.target.value as SortDirection })}
        className="rounded-md border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-sm p-1.5"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}