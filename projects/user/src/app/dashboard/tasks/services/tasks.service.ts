import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http:HttpClient) {

   }

   getUserTasks(userId: string , params : any){
    return this.http.get(`${environment.baseApi}/user-tasks/${userId}`)
   }
}
