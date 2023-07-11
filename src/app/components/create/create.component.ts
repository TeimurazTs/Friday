import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EMPTY, catchError, of } from 'rxjs';
import {
  BChannel,
  BroadcastChannelService,
} from 'src/app/shared/broadcast/broadcast-channel.service';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { Task } from 'src/app/shared/models/task.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  constructor(
    private http: HttpService,
    private toastService: ToastService,
    @Inject(BChannel) private broadcastChannelName: BroadcastChannelService
  ) {}

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    subtitle: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.broadcastChannelName.messagesOfType('name').subscribe(() => {
      this.http.taskUpdate.next('new');
    });
  }

  onSubmit() {
    const formValue = this.taskForm.value as Task;
    this.http
      .postTask(
        {
          ...formValue,
          status: 'new',
          id: '',
        },
        'new'
      )
      .pipe(
        catchError((err) => {
          this.toastService.showError(err.message);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.http.taskUpdate.next('new');
        this.taskForm.reset();
        this.broadcastChannelName.publish({ type: 'name', payload: true });
      });
  }
}
