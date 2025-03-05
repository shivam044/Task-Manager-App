import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  // RxJS BehaviorSubjects for form fields
  taskDescription$ = new BehaviorSubject<string>('');
  dueDate$ = new BehaviorSubject<string>(''); // Expected format: "yyyy-MM-dd"
  priority$ = new BehaviorSubject<'low' | 'medium' | 'high'>('low');

  constructor(private taskService: TaskService) {}

  onAddTask(): void {
    const description = this.taskDescription$.getValue();
    if (!description.trim()) {
      return;
    }
    // Convert the dueDate string ("yyyy-MM-dd") to a local Date object at midnight.
    let dueDateObj: Date | undefined;
    const dueDateStr = this.dueDate$.getValue();
    if (dueDateStr && dueDateStr.trim()) {
      const parts = dueDateStr.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10); // months are 1-indexed
      const day = parseInt(parts[2], 10);
      dueDateObj = new Date(year, month - 1, day);
    }
    const priority = this.priority$.getValue();

    const newTask: Task = {
      id: Date.now(),
      description: description.trim(),
      isCompleted: false,
      dueDate: dueDateObj,
      priority: priority
    };

    console.log('Adding task:', newTask);
    this.taskService.addTask(newTask);

    // Reset the BehaviorSubjects.
    this.taskDescription$.next('');
    this.dueDate$.next('');
    this.priority$.next('low');
  }
}
