import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';

// Model
import { Agenda } from '../../model/agenda';

@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})
export class AgendaPage implements OnInit, OnDestroy {
  agenda: Agenda;
  //events: Event[];
  event: any;
  events: any[];
  message: string;

  constructor(public navCtrl: NavController, private fhService: FHService) {

  }

  // 
  ngOnInit() {
    this.getEvents();
  }

  // 
  ngOnDestroy() {
  }

  getEvents() {
    console.log('Before calling hello endpoint');

    this.message = 'Before calling...';

    this.fhService.getEventsAtLocationForToday('SPAIN', 'MADRID')
    .then( (events) => {
      this.events = events;
      if (this.events !== null && this.events.length >= 0) {
        this.event = this.events[0];
        this.agenda = this.event.agenda;
      } else {
        this.message = 'No events!';
      }
      
    })
    .catch( (err) => {
      console.log(err);
      this.message = JSON.stringify(err);
    });

  }

}
