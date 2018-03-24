import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';


@Component({
  selector: 'app-login-souq',
  templateUrl: './login-souq.component.html',
  styleUrls: ['./login-souq.component.css']
})
export class LoginSouqComponent implements OnInit {
  FbookUrl:any;
  GmailUrl:any;
  UserLogTokem:any;
  logedUser:any;
  user={email:"",password:""};
  loginPage=false;

  constructor(private loginService: LoginService){

  //web servic take token then retrieve it's rule and info needed
  if(localStorage.getItem('Souqlogin')){//there token exist in localS
    this.loginService.verifyToken().subscribe((res)=>{
      if(res['success']&&localStorage.getItem('Souqlogin')=="true"){
       console.log("login",JSON.parse(localStorage.getItem('SouqloginUser')).nationalID)
      if(!JSON.parse(localStorage.getItem('SouqloginUser')).nationalID)
        window.location.href = 'http://localhost:4200/souq/home';
      else
        window.location.href = 'http://localhost:4200/souq/seller/home';
      }

    });
  }
  else{//user isnot logged
        this.loginPage=true;
        this.loginService.getGmailURL().subscribe((res)=>{
          this.FbookUrl=res;
        });
        this.loginService.getFacebookURL().subscribe((res)=>{
          this.GmailUrl=res;
        });
      }
    }

  ngOnInit(): void {
    console.log("init")
  }

  getToken(): void {
    this.loginService.getUserLoginToken(this.user.email,this.user.password).subscribe((res)=>{
      console.log(res);
      if(res.success){
        localStorage.setItem('SouqtokenKey', res.token);
        localStorage.setItem('Souqlogin', "true");
        localStorage.setItem('SouqloginUser', JSON.stringify(res.user));
        this.logedUser=res.user;
        console.log("click",this.logedUser);
        window.location.href = 'http://localhost:4200/souq/home';
       }
      else
      console.log(res);
    });
  }


  access():void{
    console.log("clicccc");
    this.loginService.accessProtected().subscribe((res)=>{
      console.log(res)
    });

  }
}