import { Component, OnInit, OnChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

import { ReviveAppointmentsComponent } from '../revive-appointments/revive-appointments.component';

import * as myGlobals from '../globals';

@Component({
  selector: 'app-queue-status',
  templateUrl: './queue-status.component.html',
  styleUrls: ['./queue-status.component.css']
})

export class QueueStatusComponent implements OnInit {

	results: any;

	queue_position: string;
	private url = myGlobals.url + 'api/queue/';

  private load_component = false;
  accepting_appointments = false;
	queue_id: String;
  logged_in: boolean;
  queue_name: string;

    constructor(private http: HttpClient, private cookieService : CookieService) { }

    ngOnInit(): void {

    }

    ngOnChanges() {
          
    }

  	onClick() {

      this.load_component = false; 

  		this.handleEvent();
 	}

    onKeyUp() {

      this.load_component = false;

      this.handleEvent();

    }


  	handleEvent() {

      let retrieveappointments = new ReviveAppointmentsComponent(this.http, this.cookieService);

  		if(this.queue_id != null) {

  			console.log(this.queue_id);

  			this.getQueueStatus();

        //retrieveappointments.onClick();

  		} else {

  			alert('No entry found');

  		}	

  	}

  	getQueueStatus() {

  		return this.http.get( this.url + this.queue_id )
  						.subscribe((res: Response) => {

  		console.log(res);

    this.queue_id = res['id'];
		this.queue_position = res['position'];


    if ( res['accepting_appointments'] == 1 )

      this.accepting_appointments = true;

    this.queue_name = res['name'];

       this.load_component = true;

    //this.displayResult();
  		
  	}, (error: Response) => {

        if(error.status == 401)
          alert('Queue not found');
      }); 
  }

  /*getAppointments() {

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

          this.load_component = true;
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

    }  */

  /*displayResult() {

    var label = document.getElementById('queue_pos');

    label.innerHTML = '<h3> Queue Position:   </h3>' + this.queue_position;
                       //'<h3> Queue ID:   </h3>' + this.queue_id; 
    }*/
  
}
