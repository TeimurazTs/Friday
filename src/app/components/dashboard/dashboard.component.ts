import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TaskComponent } from 'src/app/shared/components/task/task.component';
import { Task } from 'src/app/shared/models/task.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { HeaderComponent } from '../header/header.component';
import { CreateComponent } from '../create/create.component';

@Component({
  standalone: true,
  imports: [CommonModule, TaskComponent, HeaderComponent, CreateComponent],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  newTasks$!: Observable<Task[]>;
  inProgressTasks$!: Observable<Task[]>;
  doneTasks$!: Observable<Task[]>;

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.newTasks$ = this.taskLoader('new');
    this.inProgressTasks$ = this.taskLoader('inProgress');
    this.doneTasks$ = this.taskLoader('done');
    this.http.taskUpdate.subscribe((status) => {
      if (status === 'new') {
        this.newTasks$ = this.taskLoader(status);
      } else if (status === 'inProgress') {
        this.inProgressTasks$ = this.taskLoader(status);
      } else if (status === 'done') {
        this.doneTasks$ = this.taskLoader(status);
      }
    });
  }

  taskLoader(status: string) {
    return this.http
      .fetchTasks(status)
      .pipe(map((response) => this.http.filterTasks(response, status)));
  }
}
