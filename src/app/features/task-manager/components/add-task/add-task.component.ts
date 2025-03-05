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
  dueDate: string = ''; // using native date input returns a string in "yyyy-MM-dd" format
  priority: 'low' | 'medium' | 'high' = 'low';

  constructor(private taskService: TaskService) {}

  onAddTask(): void {
    if (!this.taskDescription.trim()) {
      return;
    }

    // Convert the dueDate string ("yyyy-mm-dd") to a local Date object manually.
    let dueDateObj: Date | undefined;
    if (this.dueDate && this.dueDate.trim()) {
      const parts = this.dueDate.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // 1-indexed
      const day = parseInt(parts[2], 10);
      dueDateObj = new Date(year, month - 1, day); // local date
    }

    const newTask: Task = {
      id: Date.now(),
      description: this.taskDescription.trim(),
      isCompleted: false,
      dueDate: dueDateObj,
      priority: this.priority
    };

    this.taskService.addTask(newTask);
    // Reset form fields
    this.taskDescription = '';
    this.dueDate = '';
    this.priority = 'low';
  }
}
