import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks';
  private tasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  getTasks(): Task[] {
    return this.tasksSubject.getValue();
  }

  addTask(task: Task): void {
    const updatedTasks = [...this.getTasks(), task];
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks);
  }

  updateTask(updatedTask: Task): void {
    const updatedTasks = this.getTasks().map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks);
  }

  deleteTask(id: number): void {
    const updatedTasks = this.getTasks().filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);
    this.saveTasks(updatedTasks);
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  private loadTasks(): void {
    const storedTasks = localStorage.getItem(this.storageKey);
    if (storedTasks) {
      this.tasksSubject.next(JSON.parse(storedTasks));
    }
  }
}
