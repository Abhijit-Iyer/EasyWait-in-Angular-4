import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

import { QueueStatusComponent } from '../queue-status/queue-status.component';
import * as myGlobals from '../globals';

@Component({

  selector: 'app-display-queue-status',
  templateUrl: './display-queue-status.component.html',
  styleUrls: ['./display-queue-status.component.css']
})


 export class DisplayQueueStatusComponent implements OnInit {


     @Input() queue_position: string;
     @Input() queue_id: string;
     @Input() queue_name: string;
     @Input() accepting_appointments: boolean;
     @Input() private load_component = false;

  reference_name: string;
  private url = myGlobals.url + 'api/queue/';
  status: string;

   logged_in: boolean;
   appointments: any;
   position: string;
   appointments_flag = 0;

   constructor(private http : HttpClient, private cookieService : CookieService) {

    }

   ngOnInit() {
       this.getAppointments();
   }

   onClick() {

     this.reference_name = prompt('In whose name would you like to book an appointment?');

     if(this.reference_name == null || this.reference_name == "") {

         alert("We're so sorry. But bookings here can't be made without a reference name!");

     } else {

         this.bookAppointment();

         this.getAppointments();

         /*let object = new QueueStatusComponent(this.http, this.cookieService);

         object.getAppointments();

         this.appointments_flag = 1;
         this.appointments_flag = 0; */


         //alert('Your appointment has been booked for the reference name ' + this.reference_name)

     }


   }

   onClickCancel(details) {

     this.cancelAppointment(details);

     this.getAppointments();

   }

   bookAppointment() {

     let post = {action:  'book',reference: this.reference_name};

     this.http.post(this.url + this.queue_id + '/appointment', post, {

     headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.cookieService.get('sign_up_token'))

     }) .subscribe((response: Response) => {

     if(response['error'] == false)

         this.status = 'Your appointment has been booked, ' + this.reference_name + '!';

     else

         this.status = 'Bookings Closed for this queue';

     console.log(this.status);

     alert(this.status);

     }, (error: Response) => {

     if(error.status == 401)

         alert('Please Log-In to continue');

     else if(error.status == 404)

         alert('Requested Queue could not be found');

     else if(error.status == 403)

         alert('Appointments CLosed');

     });

   }

   cancelAppointment(details) {

       //console.log("Hello");

    //this.position = prompt("Enter the position which you'd like to cancel");

    this.position = details;

    console.log(details);

    let post = {action:  'cancel',position: this.position};

    this.http.post(this.url + this.queue_id + '/appointment', post, {

      headers: new HttpHeaders() .set('Authorization', 'Bearer ' + this.cookieService.get('sign_up_token'))

    }) .subscribe((response: Response) => {

    if(response['error'] == false)
      
      this.status = 'Your appointment has been cancelled for the position ' + this.position + '.';
    
    else
      
      this.status = 'Bookings Closed for this queue';
              
    }, (error: Response) => {

    if(error.status == 401)
        
        alert('Please Log-In to continue');
    
    else if(error.status == 404)
        
        alert('Requested Queue could not be found');
    
    else if(error.status == 403)
      
      alert('Appointments CLosed');

    });

    }


    getAppointments() {

    this.http.get(this.url + this.queue_id + '/appointment', {

              headers: new HttpHeaders()
              .set('Authorization', 'Bearer ' + this.cookieService.get('sign_up_token'))

            })
        .subscribe((response: Response) => {

          if(response == null) {
              this.appointments_flag = 1;
          } else {
            this.appointments_flag = 0;
          }

          //this.load_component = true;
          console.log(response);
          
          this.appointments = response['appointments'];

          //this.displayResult();

          }, (error: Response) => {

            console.log(error.status);

            if(error.status == 401) {

              alert('Please Log-In to continue');

              this.logged_in = false;

            }

            else if(error.status == 404)

              alert('Requested Queue could not be found');

            else if(error.status == 403)

              alert('Appointments Closed');

            else

              this.logged_in = true;

          });

    }

 } 

