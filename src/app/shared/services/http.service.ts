import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import { Subject, concatMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  taskUpdate = new Subject<string>();
  isLoading = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // this method is used for fetching tasks.
  fetchTasks(status: String) {
    return this.http.get<Task[]>(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}.json`
    );
  }

  // thi method is used for saving a new task.
  postTask(task: Task, status: string) {
    return this.http.post<Task>(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}.json`,
      task
    );
  }

  // This is a method used for deleting a task.
  deleteTask(id: string, status: string) {
    return this.http.delete(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}/${id}.json`
    );
  }

  //This method is responsible for moving data inbetween task columns
  reArrangeTask(task: Task, newStatus: string) {
    return this.deleteTask(task.id, task.status).pipe(
      concatMap(() => {
        return this.postTask({ ...task, status: newStatus }, newStatus);
      })
    );
  }

  // This is a helper method used for creating an array out of object.
  filterTasks(response: Object): Task[] {
    return Object.entries(response).map(([key, value]) => {
      const task = { ...value, id: key };
      return task;
    });
  }
}
