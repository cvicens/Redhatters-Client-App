import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { SocketService } from '../../services/socket.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage implements OnInit, OnDestroy {
  // Event hashtag
  hashtag;
  // Is view active?
  viewActive: boolean = false;

  // Observables...
  startQuizConnection;
  stopQuizConnection;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private socketService: SocketService, private stateService: StateService) {
    
  }

  // 
  ngOnInit() {
    this.stateService.eventHashtag.subscribe(value => {
      setTimeout(() => {
      this.hashtag = value; 
      console.log('🔥 Contact: this.hashtag', this.hashtag);
      //this.cd.detectChanges();
      },0);
    });

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
    console.log("ContacPage >>>>>>> active");
    this.viewActive = true;
  }

  ionViewWillEnter () {
    console.log("ContacPage >>>>>>> active");
    this.viewActive = true;
  }

  ionViewWillLeave() {
    this.viewActive = false;
    console.log("ContacPage >>>>>>> inactive");
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
