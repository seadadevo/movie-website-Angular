import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    constructor(private _AuthService:AuthService, private _Router: Router) {
    }
  
    error: string = '';
    isLoading: boolean = false;
    showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
    loginForm:FormGroup = new FormGroup({
      email:new FormControl(null, [Validators.email, Validators.required]),
      password:new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]/)]),
    })
  
  
  
  
  
  
    submitLoginForm(loginForm:FormGroup) {
      this.isLoading = true;
      this._AuthService.signin(loginForm.value).subscribe({
        next:(response)=>{
          this.isLoading = false;
          if(response.message === 'Login successful') {
            localStorage.setItem('userToken', response.token)
            this._AuthService.saveUserData()
            this._Router.navigate(['/home'])
            this.loginForm.reset();
          } 
        },
        error:(err) => {
          if(err.error&&err.error.message) {
            this.error=err.error.message
          } else {
            this.error = 'Login failed. Please try again.';
          }
          console.error(err);
        },
      }).add(() => {
      this.isLoading= false
    })
    }


    loginAsDemo() {
      // Build a fake but structurally valid JWT so jwtDecode() works
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        id: 'demo-user-001',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24h
      }));
      const fakeToken = `${header}.${payload}.demo-signature`;

      localStorage.setItem('userToken', fakeToken);
      this._AuthService.saveUserData();
      this._Router.navigate(['/home']);
    }

    ngOnInit() {
       this._AuthService.userData.subscribe({
      next:() => {
        if(this._AuthService.userData.getValue() != null) {
          this._Router.navigate(['/home'])
        }
      }
    })
    }
   

}
