export interface Task {
  id: number;
  description: string;
  isCompleted: boolean;
  dueDate?: Date;                      // Optional: For sorting by due date
  priority?: 'low' | 'medium' | 'high';  // Optional: For sorting by priority
}
