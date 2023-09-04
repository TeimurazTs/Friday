import { Component, Inject, Input, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { Task } from '../../models/task.model';
import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import {
  BChannel,
  BroadcastChannelService,
} from '../../broadcast/broadcast-channel.service';

@Component({
  standalone: true,
  imports: [MatCardModule, CommonModule],
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  constructor(
    private http: HttpService,
    private toastService: ToastService,
    @Inject(BChannel) private broadcastChannelName: BroadcastChannelService
  ) {}
  @Input() task!: Task;
  isLoading$!: Observable<boolean>;

  ngOnInit() {
    this.isLoading$ = this.http.isLoading;
    this.broadcastChannelName.messagesOfType('delete').subscribe((data) => {
      this.http.taskUpdate.next(data.payload);
      this.toastService.showSuccess(data.message);
    });
    this.broadcastChannelName.messagesOfType('reArrange').subscribe((data) => {
      this.http.taskUpdate.next(data.payload);
      this.toastService.showSuccess(data.message);
    });

    console.log(5);
  }

  onDelete(id: string, status: string) {
    this.http.isLoading.next(true);
    this.http.deleteTask(id, status).subscribe(() => {
      this.http.taskUpdate.next(status);
      this.http.isLoading.next(false);
      this.toastService.showSuccess('Task has been deleted');
      this.broadcastChannelName.publish({
        type: 'delete',
        payload: status,
        message: 'Task has been deleted',
      });
    });
  }

  onRearrangeTask(task: Task, newStatus: string) {
    if (task.status === newStatus) {
      return;
    }
    this.http.isLoading.next(true);
    this.http.reArrangeTask(task, newStatus).subscribe(() => {
      this.http.taskUpdate.next(task.status);
      this.http.taskUpdate.next(newStatus);
      this.http.isLoading.next(false);
      this.toastService.showSuccess(
        `Moved from ${task.status} to ${newStatus}`
      );
      this.broadcastChannelName.publish({
        type: 'reArrange',
        payload: task.status,
        message: '',
      });
      this.broadcastChannelName.publish({
        type: 'reArrange',
        payload: newStatus,
        message: `Moved from ${task.status} tp ${newStatus}`,
      });
    });
  }
}
