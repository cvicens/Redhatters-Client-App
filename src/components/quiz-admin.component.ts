import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

// Model
import { Quiz } from '../model/quiz';

// Services
import { SocketService } from '../services/socket.service';
import { StateService } from '../services/state.service';

// Model
import { LiveQuiz } from '../model/live-quiz';

@Component({
  selector: 'quiz-admin',
  templateUrl: './quiz-admin.component.html',
  //providers: [SocketService, FHService]
})
export class QuizAdminComponent implements OnInit, OnDestroy {
  quizStarted: boolean = false;
  quizEnded: boolean = false;

  constructor(private cd: ChangeDetectorRef, private socketService: SocketService, private stateService: StateService) {

  }

  startQuiz() {
    console.log('Before calling startQuiz');
    this.stateService.startQuiz();
  }

  stopQuiz() {
    console.log('Before calling stopQuiz');
    this.stateService.stopQuiz();
  }

  nextQuestion() {
    console.log('Before calling nextQuestion');
    this.stateService.nextQuestion();
  }

  nextButtonEnabled () {
    //return this.quizStarted && !this.quizEnded;
    return !this.quizEnded;
  }

  // Let's subscribe our Observable
  ngOnInit() {
    // Subscribe to stateService observables
    this.stateService.quizStarted.subscribe(value => {
      setTimeout(() => {
      this.quizStarted = value; 
      console.log('🔥 QuizAdmin: this.quizStarted', this.quizStarted);
      this.cd.detectChanges();
      },0);
    });
    this.stateService.quizEnded.subscribe(value => {
      setTimeout(() => {
      this.quizEnded = value; 
      console.log('🔥 QuizAdmin: this.quizEnded', this.quizEnded);
      this.cd.detectChanges();
      },0);
    });
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    
  }

}
