import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
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

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private stateService: StateService) {
    
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

    // Subscribe to stateService observables regarding starting/stopping a quiz
    this.stateService.quizStarted.subscribe(quizStarted => {
      setTimeout(() => {
      console.log('🔥 Contact: this.quizStarted', quizStarted);
      //if (quizStarted) this.presentToast('Quiz has started, please go to tab Quiz!');
      },0);
    });
    this.stateService.quizStopped.subscribe(quizStopped => {
      setTimeout(() => {
      console.log('🔥 Contact: this.quizStopped', quizStopped);
      //if (quizStopped) this.presentToast('Quiz ended! Maybe the luck be with you!');
      },0);
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
