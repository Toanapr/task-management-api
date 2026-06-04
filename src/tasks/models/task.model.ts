import { TaskPriority, TaskStatus } from 'src/common/enums/task-status.enum';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createAt: Date;
}
