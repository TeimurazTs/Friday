import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  taskUpdate = new Subject<string>();
  constructor(private http: HttpClient) {}

  fetchTasks(status: String) {
    return this.http.get<Task[]>(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}.json`
    );
  }

  postTask(task: Task, status: string) {
    return this.http.post<Task>(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}.json`,
      task
    );
  }

  deleteTask(id: string, status: string) {
    this.http
      .delete(
        `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}/${id}.json`
      )
      .subscribe(() => {
        this.taskUpdate.next(status);
      });
  }

  reArrangeTask(task: Task, newStatus: string) {
    this.deleteTask(task.id, task.status);
    this.postTask({ ...task, status: newStatus }, newStatus).subscribe(() => {
      this.taskUpdate.next(newStatus);
    });
  }

  filterTasks(response: Object, taskType: string): Task[] {
    return Object.entries(response).map(([key, value]) => {
      const task = { ...value, id: key, taskType: taskType };
      return task;
    });
  }
}
