/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

// PrimeNG v19
import { providePrimeNG } from 'primeng/config';
import  LaraLightBlue  from '@primeng/themes/lara';

bootstrapApplication(AppComponent, {
  providers: [
    // Provide your routes
    provideRouter(appRoutes),

    // Provide Angular animations
    provideAnimations(),

    // Provide PrimeNG with a light theme
    providePrimeNG({
      theme: {
        preset: LaraLightBlue,
        options: {
          darkModeSelector: false || 'none'
      }
      }
    })
  ]
}).catch(err => console.error(err));
