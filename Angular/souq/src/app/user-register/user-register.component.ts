import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent implements OnInit {
  image; /* property of File type */
  constructor(private loginService: LoginService) {}
  submitIt(form) {
    console.log(form.valid);
    form.value.image=this.image;
    this.loginService.register(form.value).subscribe((res)=>{
    console.log(res);
  });
}
fileUpload(files)
{
  console.log(files[0]);
  this.image = files[0];
  var myReader:FileReader = new FileReader();
  myReader.readAsDataURL(this.image);
  myReader.onloadend = (e) => {
    this.image = myReader.result;
    console.log(this.image)
  }
}


  ngOnInit() {
  }

}
