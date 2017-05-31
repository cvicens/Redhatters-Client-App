import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { StateService } from '../../services/state.service';

// Model
import { Agenda } from '../../model/agenda';
import { Event } from '../../model/event';

@Component({
  selector: 'page-agenda',
  templateUrl: 'agenda.html'
})
export class AgendaPage implements OnInit, OnDestroy {
  agenda: Agenda;
  //events: Event[];
  event: Event;
  events: any[];
  message: string;

  constructor(public navCtrl: NavController, private fhService: FHService, private stateService: StateService) {

  }

  // 
  ngOnInit() {
    this.getEvents();
  }

  // 
  ngOnDestroy() {
  }

  getEvents() {
    console.log('Before calling getEvents endpoint');

    this.message = 'Before calling...';

    this.fhService.getEventsAtLocationForToday('SPAIN', 'MADRID')
    .then( (events) => {
      this.events = events;
      // Lets update the state of the app...
      this.stateService.updateEvents(this.events);

      if (this.events !== null && this.events.length >= 1) {
        // TODO Here we select the first event... it should be an actionSheet!

        this.event = this.events[0];
        this.agenda = this.event.agenda;

        // Lets update the state of the app...
        this.stateService.updateEventId(this.event.id);
        this.stateService.updateQuizId(this.event.quizId);

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
