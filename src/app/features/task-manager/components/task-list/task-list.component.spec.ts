import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Task } from '../../../../core/models/task.model';
import { Component } from '@angular/core';

// Create a dummy TaskItemComponent since TaskListComponent uses it
@Component({
  selector: 'app-task-item',
  standalone: true,
  template: '<li></li>'
})
class DummyTaskItemComponent {}

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  // Dummy tasks for testing purposes
  const dummyTasks: Task[] = [
    { id: 1, description: 'Task 1', isCompleted: false, dueDate: new Date(), priority: 'low' } as Task,
    { id: 2, description: 'Task 2', isCompleted: true, dueDate: new Date(), priority: 'high' } as Task
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent, DummyTaskItemComponent],
      providers: [provideAnimations()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    // Override the filteredTasks getter to return our dummy tasks
    spyOnProperty(component, 'filteredTasks', 'get').and.returnValue(dummyTasks);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update filter when setFilter is called', () => {
    component.setFilter('completed');
    expect(component.filter).toBe('completed');
  });

  it('should update sortOption when setSortOption is called', () => {
    component.setSortOption('priority');
    expect(component.sortOption).toBe('priority');
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
