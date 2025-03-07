import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-add-task',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, DatePicker, FormsModule, ButtonModule, InputTextModule, ToastModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  // RxJS BehaviorSubjects for form fields
  taskDescription$ = new BehaviorSubject<string>('');
  // dueDate$ = new BehaviorSubject<string>(''); // Expected format: "yyyy-MM-dd"
  priority$ = new BehaviorSubject<'default' | 'low' | 'medium' | 'high'>('default');

  // Use a normal property for the due date with a Date type for the PrimeNG DatePicker.
  dueDate: Date | undefined;

   // Error message properties for inline validation messages.
   taskDescriptionError: string | null = null;
   dueDateError: string | null = null;
   priorityError: string | null = null;

  constructor(private taskService: TaskService, private messageService: MessageService) {}

  handleTaskDescriptionChange(event: any): void {
    console.log('Task description changed:', event.target.value);
    const description = event.target.value.trim();
    if(description.length > 0) {
      this.taskDescriptionError = null;
    } else {
      this.taskDescriptionError = 'Task description is required.';
    }
  }

  onAddTask(): void {
    const description = this.taskDescription$.getValue().trim();
    const priority = this.priority$.getValue();

    // Reset error messages before validation.
    this.taskDescriptionError = null;

    let valid = true;

    // Validate task description.
    if (!description) {
      this.taskDescriptionError = 'Task description is required.';
      valid = false;
    }

    // If any field is invalid, show a general error toast and exit.
    if (!valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill out all required fields correctly.'
      });
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      description: description,
      isCompleted: false,
      dueDate: this.dueDate,
      priority: priority as 'low' | 'medium' | 'high'
    };

    console.log('Adding task:', newTask);
    this.taskService.addTask(newTask);

    // Show success message.
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Task added successfully.'
    });

    // Reset the form fields.
    this.taskDescription$.next('');
    this.dueDate = undefined;
    this.priority$.next('default');
  }
}
