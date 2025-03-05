import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';
import { FormsModule } from '@angular/forms';

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

  constructor(private taskService: TaskService) {}

  toggleTask(): void {
    this.task.isCompleted = !this.task.isCompleted;
    this.taskService.updateTask(this.task);
  }

  delete(): void {
    this.deleteTask.emit(this.task);
  }

  editTask(): void {
    // Switch to edit mode and copy the current description
    this.isEditing = true;
    this.editedDescription = this.task.description;
  }

  finishEdit(): void {
    // Save changes only if there's a non-empty updated value
    if (this.editedDescription.trim()) {
      this.task.description = this.editedDescription.trim();
      this.taskService.updateTask(this.task);
    }
    this.isEditing = false;
  }

  cancelEdit(): void {
    // Exit edit mode without saving changes
    this.isEditing = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.finishEdit();
    }
  }
}
