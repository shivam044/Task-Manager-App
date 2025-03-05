import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TaskItemComponent } from './task-item.component';
import { Task } from '../../../../core/models/task.model';
import { TaskService } from '../../../../core/services/task.service';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskService', ['updateTask']);

    await TestBed.configureTestingModule({
      imports: [TaskItemComponent, FormsModule],
      providers: [{ provide: TaskService, useValue: spy }]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    // Initialize a dummy task
    component.task = {
      id: 1,
      description: 'Test Task',
      isCompleted: false,
      dueDate: new Date(),
      priority: 'medium'
    } as Task;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
