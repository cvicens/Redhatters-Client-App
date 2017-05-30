import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Event } from '../../model/event';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';

let IMAGES = {
    'HELLO CARLOS': 'card-amsterdam',
    'HELLO PEDRO': 'card-madison',
    'HELLO PAOLO': 'card-saopaolo',
    DEFAULT: 'card-sf'
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {
  agenda: any;
  event: any;
  //events: Event[];
  events: any[];
  name: string;
  helloMessage: string = '';
  cardImage: string = 'assets/images/' + IMAGES['DEFAULT'] + '.png';

  constructor(public navCtrl: NavController, private fhService: FHService) {

  }

  // 
  ngOnInit() {
    this.getEvents();
  }

  // 
  ngOnDestroy() {
  }

  sayHello () {
    console.log('Before calling hello endpoint');

    this.helloMessage = 'Before calling...';

    this.fhService.sayHello('hello', 'POST', this.name)
    .then( (result) => {
      console.log('result', result);
      this.helloMessage = result.msg.toUpperCase();
      if (result && result.msg && IMAGES[result.msg.toUpperCase()]) {
        this.cardImage = 'assets/images/' + IMAGES[result.msg.toUpperCase()] + '.png';
      } else {
        this.cardImage = 'assets/images/' + IMAGES['DEFAULT'] + '.png';
      }
    })
    .catch( (err) => {
      console.log(err);
      this.helloMessage = JSON.stringify(err);
    });

  }

  getEvents() {
    console.log('Before calling hello endpoint');

    this.helloMessage = 'Before calling...';

    this.fhService.getEventsAtLocationForToday('SPAIN', 'MADRID')
    .then( (events) => {
      this.events = events;
      if (this.events !== null && this.events.length >= 0) {
        this.event = this.events[0];
        this.agenda = this.event.agenda;
      } else {
        this.helloMessage  = 'No events!';
      }
    })
    .catch( (err) => {
      console.log(err);
      this.helloMessage = JSON.stringify(err);
    });

  }

}
