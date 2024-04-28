import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account, Login } from '../context/DTOs';
import { environment } from 'projects/user/src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }

  createAccount(model:Account){
    return this.http.post(`${environment.baseApi.replace('tasks','auth')}/createAccount`,model)
  }


  login(model : Login){
      return this.http.post(`${environment.baseApi.replace('tasks','auth')}/login`,model)
  }

}
