import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, map, of, switchMap, tap } from 'rxjs';
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
    this.newTasks$ = this.http
      .fetchTasks('new')
      .pipe(map((response) => this.filterTasks(response, 'new')));
    this.inProgressTasks$ = this.http
      .fetchTasks('inProgress')
      .pipe(map((response) => this.filterTasks(response, 'inProgress')));
    this.doneTasks$ = this.http
      .fetchTasks('done')
      .pipe(map((response) => this.filterTasks(response, 'done')));
    this.http.taskUpdate.subscribe(() => {
      console.log('it came here');
      this.newTasks$ = this.http.fetchTasks('new').pipe(
        tap(() => console.log('inside pipe')),
        map((response) => this.filterTasks(response, 'new'))
      );
    });
  }

  filterTasks(response: Object, taskType: string): Task[] {
    return Object.entries(response).map(([key, value]) => {
      const task = { ...value, id: key, taskType: taskType };
      return task;
    });
  }
}
