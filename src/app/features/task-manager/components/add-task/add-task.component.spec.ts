import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskComponent } from './add-task.component';
import { TaskService } from '../../../../core/services/task.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Task } from '../../../../core/models/task.model';
import { FormsModule } from '@angular/forms';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let parserFormatterSpy: jasmine.SpyObj<NgbDateParserFormatter>;

  beforeEach(async () => {
    const taskService = jasmine.createSpyObj('TaskService', ['addTask']);
    const parserFormatter = jasmine.createSpyObj('NgbDateParserFormatter', ['format']);

    await TestBed.configureTestingModule({
      imports: [AddTaskComponent, FormsModule],
      providers: [
        { provide: TaskService, useValue: taskService },
        { provide: NgbDateParserFormatter, useValue: parserFormatter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    parserFormatterSpy = TestBed.inject(NgbDateParserFormatter) as jasmine.SpyObj<NgbDateParserFormatter>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add task if taskDescription is empty or whitespace', () => {
    component.taskDescription = '   ';
    component.onAddTask();
    expect(taskServiceSpy.addTask).not.toHaveBeenCalled();
  });

  it('should add task and reset form fields when onAddTask is called with valid data', () => {
    component.taskDescription = 'New Task';
    component.dueDate = { year: 2023, month: 4, day: 15 };
    component.priority = 'medium';

    component.onAddTask();

    expect(taskServiceSpy.addTask).toHaveBeenCalled();
    const taskArg = taskServiceSpy.addTask.calls.mostRecent().args[0] as Task;
    expect(taskArg.description).toBe('New Task');
    expect(taskArg.isCompleted).toBeFalse();
    expect(taskArg.priority).toBe('medium');
    expect(taskArg.dueDate).toEqual(new Date(2023, 3, 15));

    expect(component.taskDescription).toBe('');
    expect(component.dueDate).toEqual({} as any);
    expect(component.priority).toBe('low');
  });
});
