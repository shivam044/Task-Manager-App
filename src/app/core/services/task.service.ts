import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private storageKey = 'tasks';
  private tasks: Task[] = [];

  constructor() {
    this.loadTasks();
  }

  /**
   * Returns the current list of tasks.
   */
  getTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Adds a new task and persists the updated list.
   * @param task The task to add.
   */
  addTask(task: Task): void {
    this.tasks.push(task);
    this.saveTasks();
  }

  /**
   * Updates an existing task and persists the updated list.
   * @param updatedTask The task with updated details.
   */
  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveTasks();
    }
  }

  /**
   * Deletes a task by its id and persists the updated list.
   * @param id The id of the task to delete.
   */
  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveTasks();
  }

  /**
   * Persists the tasks array to localStorage.
   */
  private saveTasks(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  /**
   * Loads tasks from localStorage into the in-memory array.
   */
  private loadTasks(): void {
    const storedTasks = localStorage.getItem(this.storageKey);
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
  }
}
