export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'done';
export type SortField = 'title' | 'dueDate' | 'priority' | 'createdAt';
export type SortDirection = 'asc' | 'desc';
export type Theme = 'light' | 'dark' | 'system';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  tags: string[];
  priority: Priority;
  status: Status;
  isRecurring: boolean;
  recurringInterval?: number;
  createdAt: Date;
  completedAt?: Date;
  deleteTimeout?: number;
}

export interface TaskFilters {
  search: string;
  tags: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  priority?: Priority;
}

export interface TaskSort {
  field: SortField;
  direction: SortDirection;
}