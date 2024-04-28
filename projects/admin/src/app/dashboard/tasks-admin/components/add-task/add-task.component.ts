import { Component, OnInit , Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TasksService } from '../../services/tasks.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationComponent } from '../confirmation/confirmation.component';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {



  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private fb: FormBuilder, 
    public dialog: MatDialogRef<AddTaskComponent>,
    public matDialog: MatDialog,
    private service: TasksService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService) { }

  users: any = [
    {name:"Moahmed" , id:'651c94622d27f6577a19a3e6'},
    {name:"Ali" , id:'6521420fcaafb7e218cbaed7'}
  ]

  newTaskForm!: FormGroup;
  fileName = "";
  formValues : any;
  ngOnInit(): void {
    console.log(this.data);
    
    this.createForm();
  }

  createForm() {
    this.newTaskForm = this.fb.group({
      title: [this.data?.title||'', [Validators.required, Validators.minLength(5)]],
      userId: [this.data?.userId._id||'', Validators.required],
      image: [this.data?.image||'', Validators.required],
      description: [this.data?.description||'', Validators.required],
      deadline: [this.data? new Date(this.data?.deadline.split('-').reverse().join('-')).toISOString() : '', Validators.required]
    })
    this.formValues = this.newTaskForm.value;
    //console.log(new Date(this.data?.deadline).toISOString());
    
  }
  
  selectImage(event: any) {
    console.log(event);
    this.newTaskForm.get('image')?.setValue(event.target.files[0]);
    this.fileName = event.target.value;
  }

  createTask() {

    let model = this.prepareFormData();
    this.service.createTask(model).subscribe(res => {
      this.toaster.success("Task Created Succesfully")

      this.dialog.close(true);
    })
  }

  prepareFormData() {
    let newDate = moment(this.newTaskForm.value['deadline']).format('DD-MM-YYYY');
    let formData = new FormData();
    Object.entries(this.newTaskForm.value).forEach(([key, value]: any) => {
      if (key == 'deadline') {
        formData.append(key, newDate);
      } else {
        formData.append(key, value);
      }
    })
    return formData;
  }

  updateTask(){
    
    let model = this.prepareFormData();
    this.service.updateTask(model,this.data._id).subscribe(res => {
      this.toaster.success("Task Updated Succesfully")

      this.dialog.close(true);
    })
  }

  close() {
    let hasChanges = false;
    Object.keys(this.formValues).forEach((item) => {
      
        if (this.formValues[item] == this.newTaskForm.value[item]) {
          hasChanges = true;
        }
    });

    if(hasChanges){
      const dialogRef = this.matDialog.open(ConfirmationComponent, {
        width:'750px',
        disableClose: true

        //data: {name: this.name, animal: this.animal},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result==true){
         
        }
        
        //this.animal = result;
      });
    }else{
      this.dialog.close();
    }
  }

}
