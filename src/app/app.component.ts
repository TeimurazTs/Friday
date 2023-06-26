import { Component } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';


@Component({
  standalone: true,
  imports: [DashboardComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
