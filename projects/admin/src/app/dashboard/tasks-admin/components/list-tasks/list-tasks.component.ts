import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { TasksService } from '../../services/tasks.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
export interface PeriodicElement {
  title: string;
  user: string;
  deadLineDate: string;
  status: string;
}


@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss']
})
export class ListTasksComponent implements OnInit {
  displayedColumns: string[] = ['position', 'title', 'user' ,'deadline','status', 'actions'];
  dataSource :any = [];
  tasksFilter!:FormGroup
  page:any = 1;
  filtration:any = {
    page : this.page,
    limit : 10
  };
  timeOutId : any;
 
  total:any;
  users:any = [
    {name:"Moahmed" , id:'651c94622d27f6577a19a3e6'},
    {name:"Ali" , id:'6521420fcaafb7e218cbaed7'}
  ]

  status:any = [
    {name:"Complete"},
    {name:"In-Progress"},
  ]


  constructor(private service : TasksService , private dialog: MatDialog, private spinner : NgxSpinnerService,private toaster : ToastrService) { }

  ngOnInit(): void {
   // this.createform()
  this.getAllTasks();
  }

  search(event :any){
    this.filtration['keyword'] = event.value
    this.filtration['page'] = 1
    this.page = 1
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(()=>{
      this.getAllTasks();
    },2000);
  }

  selectUser(event : any){
    this.filtration['page'] = 1
    this.page = 1
    console.log(event);
    this.filtration['userId'] = event.value;
    this.getAllTasks();
  }

  selectStatut(event:any){
    this.filtration['page'] = 1
    this.page = 1
    this.filtration['status'] = event.value;
    this.getAllTasks();
  }

  getAllTasks() {
    this.service.getAllTasks(this.filtration).subscribe((res : any) => {
      this.dataSource =this.mappingTasks(res.tasks);
      this.total = res.totalItems;
    });
  }

  // filter(type : string) {
  //   switch (type) {
  //     case 'key':
        
  //       break;
    
  //     default:
  //       break;
  //   }
  // }

  selectDate(event : any,type : string){
    this.filtration['page'] = 1
    this.page = 1
    this.filtration[type] = moment(event.value).format('DD-MM-YYYY');
    if(type =='toDate' && this.filtration['toDate'] !== 'Invalid date'){
      this.getAllTasks();
    }
  }

  addTask():void{
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width:'750px',
      disableClose: true
      //data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.getAllTasks();
      }
      
      //this.animal = result;
    });

  }

  mappingTasks(data : any[]){
    let newTasks = data.map(item=>{
      return {
        ...item,
        user:item.userId.username
      }
    })
    return newTasks;

    
  }

  deleteTask(id:any){
    this.service.deleteTask(id).subscribe(res=>{
      this.spinner.hide()
      this.getAllTasks();
      this.toaster.success("Task Deleted")
      
    })
  }

  updateTask(element : any){
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width:'750px',
      data: element
      //data: {name: this.name, animal: this.animal},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==true){
        this.getAllTasks();
      }
      
      //this.animal = result;
    });
  }

  changePage(event : any){
    this.filtration['page'] = event
    this.page = event
    this.getAllTasks();
  }



}
