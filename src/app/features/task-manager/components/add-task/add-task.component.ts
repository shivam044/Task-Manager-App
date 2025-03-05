import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  taskDescription: string = '';
  dueDate: string = ''; // We'll store this as a string for now
  priority: 'low' | 'medium' | 'high' = 'low';

  constructor(private taskService: TaskService) {}

  onAddTask(): void {
    if (!this.taskDescription.trim()) {
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      description: this.taskDescription.trim(),
      isCompleted: false,
      dueDate: this.dueDate ? new Date(this.dueDate) : undefined,
      priority: this.priority
    };
    this.taskService.addTask(newTask);

    // Reset form fields
    this.taskDescription = '';
    this.dueDate = '';
    this.priority = 'low';
  }
}
