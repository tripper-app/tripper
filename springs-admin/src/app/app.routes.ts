import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./springs/spring-list.component').then((m) => m.SpringListComponent),
  },
  {
    path: 'spring/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./springs/spring-editor.component').then((m) => m.SpringEditorComponent),
  },
  { path: '**', redirectTo: '' },
];
