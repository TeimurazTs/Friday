import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TaskComponent } from 'src/app/shared/components/task/task.component';
import { Task } from 'src/app/shared/models/task.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { HeaderComponent } from '../header/header.component';
import { CreateComponent } from '../create/create.component';
import { NgToastModule } from 'ng-angular-popup';

import {
  CdkDragDrop,
  DragDropModule,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ToastService } from 'src/app/shared/services/toast.service';
import {
  BChannel,
  BroadcastChannelService,
} from 'src/app/shared/broadcast/broadcast-channel.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
    HeaderComponent,
    CreateComponent,
    NgToastModule,
    DragDropModule,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  newTasks$!: Observable<Task[]>;
  inProgressTasks$!: Observable<Task[]>;
  doneTasks$!: Observable<Task[]>;

  constructor(
    private http: HttpService,
    private toastService: ToastService,
    @Inject(BChannel) private broadcastChannelName: BroadcastChannelService
  ) {}

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

    this.broadcastChannelName.messagesOfType('drop').subscribe((data) => {
      this.http.taskUpdate.next(data.payload);
      this.toastService.showSuccess(data.message);
    });
  }

  taskLoader(status: string) {
    return this.http
      .fetchTasks(status)
      .pipe(map((response) => this.http.filterTasks(response)));
  }

  drop(event: CdkDragDrop<Task[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    const task = event.container.data[event.currentIndex];
    const newStatus = event.container.id;
    if (task.status === newStatus) {
      return;
    } else {
      this.http.reArrangeTask(task, newStatus).subscribe(() => {
        this.http.taskUpdate.next(task.status);
        this.http.taskUpdate.next(newStatus);
        this.toastService.showSuccess(
          `Moved from ${task.status} to ${newStatus}`
        );
        this.broadcastChannelName.publish({
          type: 'drop',
          payload: task.status,
          message: '',
        });
        this.broadcastChannelName.publish({
          type: 'drop',
          payload: newStatus,
          message: `Moved from ${task.status} to ${newStatus}`,
        });
      });
    }
  }

  trackByFunction(index: number, task: Task): string {
    return task.id;
  }
}
