import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger(100, [
            animate('0.3s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('0.3s ease-out', style({ opacity: 0, transform: 'translateY(20px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filter: 'all' | 'completed' | 'incomplete' = 'all';
  sortOption: 'default' | 'dueDate' | 'priority' = 'default';

  recentlyDeletedTask: Task | null = null;
  undoTimeout: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
  }

  get filteredTasks(): Task[] {
    let filtered = [...this.tasks];
    if (this.filter === 'completed') {
      filtered = filtered.filter(task => task.isCompleted);
    } else if (this.filter === 'incomplete') {
      filtered = filtered.filter(task => !task.isCompleted);
    }

    if (this.sortOption === 'dueDate') {
      filtered.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
    } else if (this.sortOption === 'priority') {
      const priorityOrder = { 'high': 1, 'medium': 2, 'low': 3 };
      filtered.sort((a, b) => {
        if (a.priority && b.priority) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return 0;
      });
    }
    return filtered;
  }

  setFilter(filter: 'all' | 'completed' | 'incomplete'): void {
    this.filter = filter;
  }

  // Here we accept a string and then cast it internally
  setSortOption(option: string): void {
    this.sortOption = option as 'default' | 'dueDate' | 'priority';
  }

  onTaskDeleted(task: Task): void {
    this.taskService.deleteTask(task.id);
    this.loadTasks();

    this.recentlyDeletedTask = task;
    if (this.undoTimeout) {
      clearTimeout(this.undoTimeout);
    }
    this.undoTimeout = setTimeout(() => {
      this.recentlyDeletedTask = null;
    }, 5000);
  }

  undoDelete(): void {
    if (this.recentlyDeletedTask) {
      this.taskService.addTask(this.recentlyDeletedTask);
      this.loadTasks();
      this.recentlyDeletedTask = null;
      clearTimeout(this.undoTimeout);
    }
  }
}
