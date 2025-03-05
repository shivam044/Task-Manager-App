import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { BehaviorSubject } from 'rxjs';

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

  isEditing = false;
  // subjects for editing fields
  editedDescription$ = new BehaviorSubject<string>('');
  editedDueDate$ = new BehaviorSubject<string>(''); // Format: "yyyy-MM-dd"
  editedPriority$ = new BehaviorSubject<'low' | 'medium' | 'high'>('low');

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
    // Populate the subjects with current values
    this.editedDescription$.next(this.task.description || '');
    if (this.task.dueDate) {
      const dateObj = new Date(this.task.dueDate);
      const year = dateObj.getFullYear();
      const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
      const day = ('0' + dateObj.getDate()).slice(-2);
      this.editedDueDate$.next(`${year}-${month}-${day}`);
    } else {
      this.editedDueDate$.next('');
    }
    this.editedPriority$.next(this.task.priority || 'low');
  }

  finishEdit(): void {
    // Get and update the description
    const newDescription = this.editedDescription$.getValue().trim();
    if (newDescription) {
      this.task.description = newDescription;
    }
    // Get and update the due date
    const dueDateStr = this.editedDueDate$.getValue().trim();
    if (dueDateStr) {
      const parts = dueDateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // 1-indexed
      const day = parseInt(parts[2], 10);
      // Create the Date at midnight local time
      this.task.dueDate = new Date(year, month - 1, day);
    } else {
      this.task.dueDate = undefined;
    }
    // Update priority
    this.task.priority = this.editedPriority$.getValue();
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
