import { useMemo } from 'react';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Task, TaskFilters, TaskSort } from '../types';

export function useFilteredTasks(
  tasks: Task[],
  filters: TaskFilters,
  sort: TaskSort,
  status: string
) {
  return useMemo(() => {
    let filteredTasks = tasks.filter((task) => task.status === status);

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter((task) =>
        filters.tags.some((tag) => task.tags.includes(tag))
      );
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filteredTasks = filteredTasks.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        const start = filters.dateRange.start
          ? startOfDay(filters.dateRange.start)
          : new Date(0);
        const end = filters.dateRange.end
          ? endOfDay(filters.dateRange.end)
          : new Date(8640000000000000);
        return isWithinInterval(taskDate, { start, end });
      });
    }

    // Apply priority filter
    if (filters.priority) {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === filters.priority
      );
    }

    // Apply sorting
    return filteredTasks.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];

      if (!aValue && !bValue) return 0;
      if (!aValue) return sort.direction === 'asc' ? 1 : -1;
      if (!bValue) return sort.direction === 'asc' ? -1 : 1;

      if (sort.direction === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }, [tasks, filters, sort, status]);
}