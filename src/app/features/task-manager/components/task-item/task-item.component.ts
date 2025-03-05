import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();

  isEditing: boolean = false;
  editedDescription: string = '';
  editedDueDate: string = ''; // Format: yyyy-MM-dd
  editedPriority: 'low' | 'medium' | 'high' = 'low';

  constructor(private taskService: TaskService) {}

  toggleTask(): void {
    this.task.isCompleted = !this.task.isCompleted;
    this.taskService.updateTask(this.task);
  }

  delete(): void {
    this.deleteTask.emit(this.task);
  }

  editTask(): void {
    this.isEditing = true;
    this.editedDescription = this.task.description;
    // Convert the task's due date to a "yyyy-MM-dd" string
    if (this.task.dueDate) {
      const dateObj = new Date(this.task.dueDate);
      const year = dateObj.getFullYear();
      const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
      const day = ('0' + dateObj.getDate()).slice(-2);
      this.editedDueDate = `${year}-${month}-${day}`;
    } else {
      this.editedDueDate = '';
    }
    this.editedPriority = this.task.priority ? this.task.priority : 'low';
  }

  finishEdit(): void {
    if (this.editedDescription.trim()) {
      this.task.description = this.editedDescription.trim();
    }
    // Update dueDate: if a date was entered, convert it manually to a Date object in local time.
    if (this.editedDueDate && this.editedDueDate.trim()) {
      const parts = this.editedDueDate.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // 1-indexed
      const day = parseInt(parts[2], 10);
      this.task.dueDate = new Date(year, month - 1, day);
    } else {
      this.task.dueDate = undefined;
    }
    this.task.priority = this.editedPriority;
    this.taskService.updateTask(this.task);
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.finishEdit();
    }
  }
}
