import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../../../core/models/task.model';
import { Component } from '@angular/core';
import { TaskService } from '../../../../core/services/task.service';

// Create a dummy TaskItemComponent since TaskListComponent uses it
@Component({
  selector: 'app-task-item',
  standalone: true,
  template: '<li></li>'
})
class DummyTaskItemComponent {}

// Dummy tasks for testing purposes
const dummyTasks: Task[] = [
  { id: 1, description: 'Task 1', isCompleted: false, dueDate: new Date('2025-03-05'), priority: 'low' } as Task,
  { id: 2, description: 'Task 2', isCompleted: true, dueDate: new Date('2025-03-11'), priority: 'high' } as Task
];

// Provide a dummy TaskService with reactive tasks$
class DummyTaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(dummyTasks);
  tasks$ = this.tasksSubject.asObservable();

  getTasks(): Task[] {
    return dummyTasks;
  }

  addTask(task: Task): void {}
  updateTask(task: Task): void {}
  deleteTask(id: number): void {}
}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, DummyTaskItemComponent],
      providers: [
        provideAnimations(),
        { provide: TaskService, useClass: DummyTaskService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update filter when setFilter is called', () => {
    component.setFilter('completed');
    expect(component.filterSubject.getValue()).toBe('completed');
  });

  it('should update sortOption when setSortOption is called', () => {
    component.setSortOption('priority');
    expect(component.sortSubject.getValue()).toBe('priority');
  });

  it('should handle onTaskDeleted correctly', () => {
    const taskToDelete: Task = { id: 1, description: 'Task 1', isCompleted: false } as Task;
    component.onTaskDeleted(taskToDelete);
    expect(component.recentlyDeletedTask).toEqual(taskToDelete);
  });

  it('should clear recentlyDeletedTask when undoDelete is called', () => {
    component.recentlyDeletedTask = { id: 1, description: 'Task 1', isCompleted: false } as Task;
    component.undoDelete();
    expect(component.recentlyDeletedTask).toBeNull();
  });
});
