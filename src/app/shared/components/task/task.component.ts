import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { Task } from '../../models/task.model';
import { HttpService } from '../../services/http.service';

@Component({
  standalone: true,
  imports: [MatCardModule],
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent {
  constructor(private http: HttpService) {}
  @Input() task!: Task;

  onDelete(id: string, status: string) {
    this.http.deleteTask(id, status);
  }

  onRearrangeTask(task: Task, newStatus: string) {
    if (task.status === newStatus) {
      return;
    }
    this.http.reArrangeTask(task, newStatus);
  }
}
