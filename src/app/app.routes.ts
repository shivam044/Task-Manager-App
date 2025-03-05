import { Routes } from '@angular/router';
import { TaskManagerComponent } from './features/task-manager/task-manager.component';

export const appRoutes: Routes = [
  // { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: '', component: TaskManagerComponent }
];
