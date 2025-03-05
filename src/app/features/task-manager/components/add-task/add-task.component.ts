import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDatepickerModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  taskDescription: string = '';

  // Due date stored as NgbDateStruct (from input)
  dueDate!: NgbDateStruct;
  priority: 'low' | 'medium' | 'high' = 'low';

  constructor(private taskService: TaskService, private parserFormatter: NgbDateParserFormatter) {}

  onAddTask(): void {
    if (!this.taskDescription.trim()) {
      return;
    }

    // Convert NgbDateStruct to JavaScript Date
    let dueDateObj: Date | undefined;
    if (this.dueDate) {
      // Option 1: Using NgbDateParserFormatter to parse the date string
      // const dateString = this.parserFormatter.format(this.dueDate);
      // dueDateObj = new Date(dateString);

      // Option 2: Direct conversion (month is 1-indexed in NgbDateStruct, but Date expects 0-indexed month)
      dueDateObj = new Date(this.dueDate.year, this.dueDate.month - 1, this.dueDate.day);
    }

    const newTask: Task = {
      id: Date.now(),
      description: this.taskDescription.trim(),
      isCompleted: false,
      dueDate: dueDateObj,
      priority: this.priority
    };

    this.taskService.addTask(newTask);
    this.taskDescription = '';
    this.dueDate = {} as NgbDateStruct;
    this.priority = 'low';
  }
}
