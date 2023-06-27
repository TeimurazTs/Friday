import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import {
  Subject,
  concat,
  concatMap,
  exhaustMap,
  mergeMap,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  taskUpdate = new Subject<string>();
  isLoading = new Subject<boolean>();
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
    return this.http.delete(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}/${id}.json`
    );
  }

  reArrangeTask(task: Task, newStatus: string) {
    this.isLoading.next(true);
    this.deleteTask(task.id, task.status)
      .pipe(
        exhaustMap((res) => {
          return this.postTask({ ...task, status: newStatus }, newStatus);
        })
      )
      .subscribe((res) => {
        this.taskUpdate.next(task.status);
        this.taskUpdate.next(newStatus);
        this.isLoading.next(false);
      });
  }

  filterTasks(response: Object, taskType: string): Task[] {
    return Object.entries(response).map(([key, value]) => {
      const task = { ...value, id: key, taskType: taskType };
      return task;
    });
  }
}
