import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

import * as myGlobals from '../globals';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

  name: string;
	email: string;
	password: string;
	token: string;
	private url = myGlobals.url + 'api/signin';
  cookieValue = 'UNKNOWN'; 

  	constructor(private http: HttpClient, private cookieService : CookieService) { }

  	ngOnInit() {
  	}

  	onKeyUp() {
  		this.getJSON();
  	}

  	onClick() {
  		this.getJSON();
  	}

  	getJSON() {
  		let post = {email: this.email, password: this.password};

  		this.http.post(this.url, post)
  		.subscribe((response: Response) => {

        this.token = response['token'];
        this.name = response['name'];

  			this.storeTokenInCookie();
        this.displayName();

      }, (error: Response) => {

        if(error.status == 401)
          alert('Invalid Credentials.');
        else
          alert('An unexpected error occured.');

      });      
    }

    storeTokenInCookie() {

      var expiry_date = new Date();      //Returns time in GMT

      expiry_date.setHours(expiry_date.getHours() + 5 + 10);  //Token will expire in 10 hours

      expiry_date.setMinutes(expiry_date.getMinutes() + 30 + 0);

      this.cookieService.set('sign_up_token',this.token, expiry_date);

      this.cookieValue = this.cookieService.get('sign_up_token');

      console.log(this.cookieValue);
    }

    displayName() {

      var label = document.getElementById('display_name_sign_in');

      label.innerHTML = 'Welcome, ' + this.name + '!';
    }
}
