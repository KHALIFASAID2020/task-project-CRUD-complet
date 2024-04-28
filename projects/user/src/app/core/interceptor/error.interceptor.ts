import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router : Router , private inject: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        let toastr = this.inject.get(ToastrService)
        toastr.error(error.error.message)
        if(error.error.message == 'jwt expired' || error.error.message == 'jwt must provided'){
          localStorage.removeItem('token')
          this.router.navigate(['/login']);
        }
        throw error
      })
    );
  }
}
