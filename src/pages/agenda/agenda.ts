import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { NavController, ToastController, ActionSheetController } from 'ionic-angular';

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

  constructor(private cd: ChangeDetectorRef, public navCtrl: NavController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private socketService: SocketService, private fhService: FHService, private stateService: StateService) {

  }

  // 
  ngOnInit() {
    // Subscribe to stateService observables
    this.stateService.eventsForToday.subscribe(value => {
      setTimeout(() => {
      this.events = value; 
      console.log('🔥 Agenda: this.events', this.events);
      //this.cd.detectChanges();

      if (this.events !== null && this.events.length >= 1) {
        // TODO Here we select the first event... it should be an actionSheet!
        if (this.events.length == 1) {
          this.stateService.selectEvent(this.events[0]);
        } else {
          this.presentActionSheet();
        }
      } else {
        this.message = 'No events!';
      }
      },0);
    });
    this.stateService.event.subscribe(value => {
      setTimeout(() => {
      this.event = value; 
      console.log('🔥 Agenda: this.event', this.event);
      //this.cd.detectChanges();
      },0);
    });
    this.stateService.eventAgenda.subscribe(value => {
      setTimeout(() => {
      this.agenda = value; 
      console.log('🔥 Agenda: this.liveQuiz', this.agenda);
      //this.cd.detectChanges();
      },0);
    });

    // Get current events for today
    this.stateService.getEventsForToday();

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

  presentToast(message) {
    if (this.viewActive) {
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }
  } 

  presentActionSheet() {
    let buttons = this.events.map((event: Event) => {
      return { text: event.city, role: null, handler: () => {
            this.event = event;
            this.stateService.selectEvent(this.event);
          }};
    });
    buttons.push({ text: 'Cancel', role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }});

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Event',
      buttons: buttons
    });

    actionSheet.present();
  }
}
