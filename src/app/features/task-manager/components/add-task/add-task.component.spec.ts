import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { TaskService } from '../../../../core/services/task.service';
import { Task } from '../../../../core/models/task.model';
import { FormsModule } from '@angular/forms';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const taskService = jasmine.createSpyObj('TaskService', ['addTask']);

    await TestBed.configureTestingModule({
      imports: [AddTaskComponent, FormsModule],
      providers: [{ provide: TaskService, useValue: taskService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add task if taskDescription is empty or whitespace', () => {
    component.taskDescription$.next('   ');
    component.onAddTask();
    expect(taskServiceSpy.addTask).not.toHaveBeenCalled();
  });

  it('should add task and reset form fields when onAddTask is called with valid data', () => {
    // Set valid input values using the BehaviorSubjects.
    component.taskDescription$.next('New Task');
    component.dueDate$.next('2023-04-15'); // ISO date string format
    component.priority$.next('medium');

    component.onAddTask();

    expect(taskServiceSpy.addTask).toHaveBeenCalled();
    const taskArg = taskServiceSpy.addTask.calls.mostRecent().args[0] as Task;
    expect(taskArg.description).toBe('New Task');
    expect(taskArg.isCompleted).toBeFalse();
    expect(taskArg.priority).toBe('medium');
    // Note: new Date(2023, 3, 15) represents April 15, 2023 (months are 0-indexed).
    expect(taskArg.dueDate).toEqual(new Date(2023, 3, 15));

    // Verify that the BehaviorSubjects are reset.
    expect(component.taskDescription$.getValue()).toBe('');
    expect(component.dueDate$.getValue()).toEqual('');
    expect(component.priority$.getValue()).toBe('low');
  });
});
