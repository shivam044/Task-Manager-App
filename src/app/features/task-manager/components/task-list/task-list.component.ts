import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { BehaviorSubject, combineLatest, Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
export class TaskListComponent implements OnInit, OnDestroy {
  // Make the filter and sort subjects public so they are accessible in the template.
  public filterSubject: BehaviorSubject<'all' | 'completed' | 'incomplete'> =
    new BehaviorSubject<'all' | 'completed' | 'incomplete'>('all');
  public sortSubject: BehaviorSubject<'default' | 'dueDate' | 'priority'> =
    new BehaviorSubject<'default' | 'dueDate' | 'priority'>('default');

  // Declare filteredTasks$ but initialize it in the constructor
  public filteredTasks$: Observable<Task[]>;

  recentlyDeletedTask: Task | null = null;
  private subscription: Subscription = new Subscription();
  private undoTimeout: any;

  constructor(private taskService: TaskService) {
    // Now that taskService is injected, initialize filteredTasks$
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$,
      this.filterSubject.asObservable(),
      this.sortSubject.asObservable()
    ]).pipe(
      map(([tasks, filter, sortOption]) => {
        let filtered = [...tasks];
        if (filter === 'completed') {
          filtered = filtered.filter(task => task.isCompleted);
        } else if (filter === 'incomplete') {
          filtered = filtered.filter(task => !task.isCompleted);
        }
        if (sortOption === 'dueDate') {
          filtered.sort((a, b) => {
            if (a.dueDate && b.dueDate) {
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            } else if (a.dueDate && !b.dueDate) {
              return -1;
            } else if (!a.dueDate && b.dueDate) {
              return 1;
            } else {
              return 0;
            }
          });
        } else if (sortOption === 'priority') {
          const priorityOrder: Record<string, number> = { high: 1, medium: 2, low: 3 };
          filtered.sort((a, b) => {
            const priorityA = a.priority ? priorityOrder[a.priority] : 999;
            const priorityB = b.priority ? priorityOrder[b.priority] : 999;
            return priorityA - priorityB;
          });
        }
        return filtered;
      })
    );
  }

  ngOnInit(): void {
    console.log('TaskListComponent initialized');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  setFilter(filter: 'all' | 'completed' | 'incomplete'): void {
    this.filterSubject.next(filter);
  }

  setSortOption(option: 'default' | 'dueDate' | 'priority'): void {
    this.sortSubject.next(option);
  }

  onTaskDeleted(task: Task): void {
    this.taskService.deleteTask(task.id);
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
      this.recentlyDeletedTask = null;
      clearTimeout(this.undoTimeout);
    }
  }
}
