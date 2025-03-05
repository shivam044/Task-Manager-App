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

  constructor(private taskService: TaskService) {}

  onAddTask(): void {
    if (!this.taskDescription.trim()) {
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      description: this.taskDescription.trim(),
      isCompleted: false
    };
    this.taskService.addTask(newTask);
    this.taskDescription = '';
  }
}
