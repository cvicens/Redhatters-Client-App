import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { SocketService } from '../../services/socket.service';
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

  viewActive: boolean = false;

  // Observables...
  startQuizConnection;
  stopQuizConnection;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private socketService: SocketService, private fhService: FHService, private stateService: StateService) {

  }

  // 
  ngOnInit() {
    this.getEvents();

    // TODO type this message!
    this.startQuizConnection = this.socketService.getStartQuizEvent().subscribe((message: any) => {
      console.log('Quiz: start quiz received', message);
      this.presentToast('Quiz has started, please go to tab Quiz!');
    });

    // TODO type this message!
    this.stopQuizConnection = this.socketService.getStopQuizEvent().subscribe((message: any) => {
      console.log('Quiz: stop quiz received', message);
      this.presentToast('Quiz ended! Maybe the luck be with you!');
    });
  }

  // 
  ngOnDestroy() {
  }

  ionViewDidLoad() {
    console.log("AgendaPage >>>>>>> active");
    this.viewActive = true;
  }

  ionViewWillEnter () {
    console.log("AgendaPage >>>>>>> active");
    this.viewActive = true;
  }

  ionViewWillLeave() {
    this.viewActive = false;
    console.log("AgendaPage >>>>>>> inactive");
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
        this.stateService.updateHashtag(this.event.hashtag);
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

  presentToast(message) {
    if (this.viewActive) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }
  } 

}
