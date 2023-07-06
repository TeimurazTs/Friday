import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { HttpService } from 'src/app/shared/services/http.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  standalone: true,
  imports: [InputComponent, ReactiveFormsModule],
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  constructor(private http: HttpService, private toastService: ToastService ) {}

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    subtitle: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    this.http
      .postTask(
        {
          title: this.taskForm.value.title || '',
          subtitle: this.taskForm.value.title || '',
          description: this.taskForm.value.description || '',
          status: 'new',
          id: '',
        },
        'new'
      )
      .subscribe(
        () => {
          this.http.taskUpdate.next('new');
          this.taskForm.reset();
        },
        (err) => {
          this.toastService.showError('An Error Occured')
        }
      );
  }
}
