import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Account } from '../../context/DTOs';
import { LoginService } from '../../services/login.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm! : FormGroup;
  constructor(private fb : FormBuilder,
    private service : LoginService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.registerForm = this.fb.group({
      email : ['',[Validators.required,Validators.email]],
      username : ['',Validators.required],
      password : ['',Validators.required],
      confirmPassword : ['',Validators.required],
      
    },{validators : this.checkPassword})
  }



  createAccount(){
    console.log(this.registerForm);
    const model:Account = {
      email : this.registerForm.value['email'],
      role : 'user',
      password : this.registerForm.value['password'],
      confirmPassword : this.registerForm.value['confirmPassword'],
      username : this.registerForm.value['username'],
    }

    this.service.createAccount(model).subscribe(res=>{

    }); 
  }

  checkPassword : ValidatorFn = (group : AbstractControl):ValidationErrors | null =>{
      let password =  group.get('password')?.value;
      let confirmPassword =  group.get('confirmPassword')?.value;
      return password == confirmPassword ? null : {notSame : true}
  }


}
