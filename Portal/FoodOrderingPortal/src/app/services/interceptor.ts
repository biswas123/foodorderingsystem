import { HttpErrorResponse, HttpResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";

import { retry, catchError, tap } from 'rxjs/operators';
import { LoadingService } from './loader/loading.service';
@Injectable({
  providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) { }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.showLoader();

    let companyObj = { "companyId": "1" };
    let requestBody = { ...companyObj, ...request.body }
    request = request.clone({
      setHeaders: {
        "Content-Type": "application/json"
      },
      body: requestBody

    });
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        
        this.onEnd();
      }
    }), catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      this.onEnd();
      return throwError(errorMessage);
    }
    ));

  }

  private onEnd(): void {
    this.hideLoader();
  }
  private showLoader(): void {
    this.loadingService.show();
  }
  private hideLoader(): void {
    this.loadingService.hide();
  }
}