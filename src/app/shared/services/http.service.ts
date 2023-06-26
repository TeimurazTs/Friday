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

  postTask(task: Task) {
    return this.http.post<Task>(
      'https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/new.json',
      task
    );
  }

  deleteTask(id: string, status: string) {
    return this.http.delete(
      `https://todoapp-24b8d-default-rtdb.europe-west1.firebasedatabase.app/task/${status}/${id}.json`
    );
  }
}
