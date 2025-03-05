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
    // 1. Copy tasks and apply filter first
    let filtered = [...this.tasks];
    if (this.filter === 'completed') {
      filtered = filtered.filter(task => task.isCompleted);
    } else if (this.filter === 'incomplete') {
      filtered = filtered.filter(task => !task.isCompleted);
    }

    // 2. Sort based on the selected option
    if (this.sortOption === 'dueDate') {
      filtered.sort((a, b) => {
        // If both tasks have due dates, compare them
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else if (a.dueDate && !b.dueDate) {
          // Tasks with a due date come first
          return -1;
        } else if (!a.dueDate && b.dueDate) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (this.sortOption === 'priority') {
      const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => {
        // If both have priority, compare them; tasks missing priority get a fallback value.
        const priorityA = a.priority ? priorityOrder[a.priority] : 999;
        const priorityB = b.priority ? priorityOrder[b.priority] : 999;
        return priorityA - priorityB;
      });
    }
    console.log('Sorted tasks:', filtered);
    return filtered;
  }

  setFilter(filter: 'all' | 'completed' | 'incomplete'): void {
    this.filter = filter;
  }

  setSortOption(option: 'default' | 'dueDate' | 'priority'): void {
    this.sortOption = option;
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
