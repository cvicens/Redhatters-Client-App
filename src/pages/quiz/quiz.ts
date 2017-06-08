import { Component, OnInit, OnDestroy } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { SocketService } from '../../services/socket.service';
import { StateService } from '../../services/state.service';

// Model
import { Quiz } from '../../model/quiz';

@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html'
})
export class QuizPage implements OnInit, OnDestroy {
  quiz: Quiz;
  message: string;
  
  // Is view active?
  viewActive: boolean = false;

  // Observables...
  startQuizConnection;
  stopQuizConnection;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, private fhService: FHService, private socketService: SocketService, private stateService: StateService) {
    
  }

  //  
  ngOnInit() {
    this.getQuizById(this.stateService.getEventId(), this.stateService.getQuizId());

    // TODO type this message!
    this.startQuizConnection = this.socketService.getStartQuizEvent().subscribe((message: any) => {
      console.log('Quiz: start quiz received', message);

      this.presentToast('Quiz has started, let\'s go down the rabbit hole!');
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
    console.log("QuizPage >>>>>>> active");
    this.viewActive = true;
  }

  ionViewWillEnter () {
    console.log("QuizPage >>>>>>> active");
    this.viewActive = true;
  }

  ionViewWillLeave() {
    this.viewActive = false;
    console.log("QuizPage >>>>>>> inactive");
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

  getQuizById(eventId: string, quizId: string) {
    console.log('Before calling getQuizById endpoint');

    this.message = 'Before calling...';

    this.fhService.getLiveQuizById(eventId, quizId)
    .then( (quiz) => {
      this.stateService.updateLiveQuiz(quiz);
      this.quiz = quiz;
    })
    .catch( (err) => {
      console.log(err);
      this.message = JSON.stringify(err);
    });

  }

}
