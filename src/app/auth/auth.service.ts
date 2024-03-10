import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/user";
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTImer: any;
  private userId: string;
  //Push authentication info to interested components
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener() {
    //so that we cant emit values from other components
    //I only want to be able to emit from within this service
    //but listen from other parts of the app
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    //Just return this result to signup. Dont subscribe here..
    return this.http
      .post(BACKEND_URL + '/signup', authData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate['/'];
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    console.log('Inside login - login clicked');
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, userId: string }>( //expecting all these 3 fields
      BACKEND_URL + '/login',
        authData
      )
      .subscribe((response) => {
        // console.log(response); // token
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;

          this.setAuthTimer(expiresInDuration);
        //   this.tokenTImer = setTimeout(() => {
        //     this.logout();
        //   }, expiresInDuration * 1000); //sec to msec

          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);

          //To save token for all come. Refresh proof
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId); 

          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  //auto authenticate based on browser data
  autoAuthUser(){
    const authInformation = this.getAuthData();
    if(!authInformation){
        return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresIn > 0){
        this.token = authInformation.token;
        this.isAuthenticated = true; 
        this.userId = authInformation.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTImer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    console.log("Setting timer: " + duration);
    this.tokenTImer = setTimeout(() => {
        this.logout();
      }, duration * 1000); //sec to msec
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId); //119
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId'); //119
  }

  private getAuthData(){
    const token =  localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate) return;
    return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
    }
  }
}
