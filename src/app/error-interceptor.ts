import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

constructor(private dialog: MatDialog){}

    //works more like middleware
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //handle gives response observable stream; pipe to add operator - catchError
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error);
                // alert(error.error.message);
                let errorMsg = "AN unknown error occurred!!"
                if (error.error.message){
                    errorMsg = error.error.message;
                }
                this.dialog.open(ErrorComponent, {data: {message: errorMsg}});
                return throwError(error)
            })
        );
    }
}