import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { BehaviorSubject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-task-item',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, DatePicker, ToastModule],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() deleteTask: EventEmitter<Task> = new EventEmitter<Task>();

  isEditing = false;
  // subjects for editing fields
  editedDescription$ = new BehaviorSubject<string>('');
  editedDueDate: Date | undefined;
  editedPriority$ = new BehaviorSubject<'low' | 'medium' | 'high'>('low');

  constructor(private taskService: TaskService, private messageService: MessageService) {}

  toggleTask(): void {
    this.task.isCompleted = !this.task.isCompleted;
    this.taskService.updateTask(this.task);
  }

  delete(): void {
    this.deleteTask.emit(this.task);
     // Show toast message for deletion
     this.messageService.add({
      severity: 'warn',
      summary: 'Task Deleted',
      detail: 'Task deleted successfully.'
    });
  }

  editTask(): void {
    this.isEditing = true;
    // Populate the subjects with current values
    this.editedDescription$.next(this.task.description || '');
    // Set the DatePicker value as a Date (or undefined)
    this.editedDueDate = this.task.dueDate ? new Date(this.task.dueDate) : undefined;
    this.editedPriority$.next(this.task.priority || 'low');
  }

  finishEdit(): void {
    // Get and update the description
    const newDescription = this.editedDescription$.getValue().trim();
    if (newDescription) {
      this.task.description = newDescription;
    }
    // Update the due date from the DatePicker
    this.task.dueDate = this.editedDueDate;

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
