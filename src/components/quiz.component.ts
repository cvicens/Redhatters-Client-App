import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ToastController } from 'ionic-angular';

// Model
import { Quiz } from '../model/quiz';
import { LiveQuiz } from '../model/live-quiz';

// Services
import { SocketService } from '../services/socket.service';
import { FHService } from '../services/fh.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  changeDetection: ChangeDetectionStrategy.Default
  //providers: [SocketService, FHService]
})
export class QuizComponent implements OnInit, OnDestroy {
  liveQuiz: LiveQuiz;

  pastQuestions = [];
  currentQuestion;
  currentQuestionIndex: number = -1;
  currentAnswer: number = -1;
  message;

  constructor(private cd: ChangeDetectorRef, public toastCtrl: ToastController, private socketService: SocketService, private fhService: FHService, private stateService: StateService) {
    
  }

  sendMessage(){
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

  submitAnswer() {
    this.stateService.submitAnswerForCurrentQuestion(this.currentAnswer);
  }

  currentAnswerChanged () {
    console.log('currentAnswerChanged', this.currentAnswer);
    this.cd.detectChanges();
  }

  currentAnswerSubmitted() {
    return typeof this.pastQuestions[this.currentQuestionIndex] !== 'undefined' &&
           typeof this.pastQuestions[this.currentQuestionIndex].submittedAnswer !== 'undefined';
  }

  answerReady(){
    return this.currentAnswer >= 0 && !this.currentAnswerSubmitted();
  }

  getLiveQuizById(eventId: string, quizId: string) {
    console.log('Before calling getQuizById endpoint');

    this.message = 'Before calling...';

    this.stateService.fetchLiveQuiz(eventId, quizId);

  }

  ngOnInit() {
    // Subscribe to stateService observables
    this.stateService.liveQuiz.subscribe(value => {
      setTimeout(() => {
      this.liveQuiz = value; 
      console.log('🔥 Quiz: this.liveQuiz', this.liveQuiz);
      this.cd.detectChanges();
      },0);
    });
    this.stateService.currentQuestion.subscribe(value => {
      setTimeout(() => {
      this.currentQuestion = value; 
      console.log('🔥 Quiz: this.currentQuestion', this.currentQuestion);
      this.cd.detectChanges();
      //this.presentToast('New question arrived!');
      },0);
    });
    this.stateService.currentQuestionIndex.subscribe(value => {
      this.currentQuestionIndex = value;
      // Reset the current answer
      this.currentAnswer = -1;
      console.log('🔥 Quiz: this.currentQuestionIndex', this.currentQuestionIndex);
      this.cd.detectChanges();
    });
    this.stateService.pastQuestions.subscribe(value => {
      this.pastQuestions = value; 
      console.log('🔥 Quiz: this.pastQuestions', this.pastQuestions);
      this.cd.detectChanges();
    });

    // Get current live quiz data
    this.getLiveQuizById(this.stateService.getEventId(), this.stateService.getQuizId());
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {

  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
