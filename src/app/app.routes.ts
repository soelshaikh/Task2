import { Routes } from '@angular/router';
import { BuilderComponent } from './FormDevelopment/builder/builder.component';
import { RendererComponent } from './FormDevelopment/renderer/renderer.component';

export const routes: Routes = [
  { path: 'builder', component: BuilderComponent },
  { path: 'renderer', component: RendererComponent },
];
