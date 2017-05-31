import { Component, Input, OnInit, OnDestroy } from '@angular/core';

// Model
import { Quiz } from '../model/quiz';

// Services
import { SocketService } from '../services/socket.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'quiz-admin',
  templateUrl: './quiz-admin.component.html',
  //providers: [SocketService, FHService]
})
export class QuizAdminComponent implements OnInit, OnDestroy {
  @Input() quiz: Quiz;

  quizStarted: boolean = false;
  startQuizConnection;
  stopQuizConnection

  constructor(private socketService: SocketService, private stateService: StateService) {

  }

  startQuiz() {
    console.log('Before calling startQuiz');
    this.socketService.startQuiz(this.stateService.getEventId(), this.stateService.getQuizId());
  }

  stopQuiz() {
    console.log('Before calling stopQuiz');
    this.socketService.stopQuiz(this.stateService.getEventId(), this.stateService.getQuizId());
  }

  nextQuestion() {
    console.log('Before calling nextQuestion');
    this.socketService.nextQuestion(this.stateService.getEventId(), this.stateService.getQuizId());
  }

  // Let's subscribe our Observable
  ngOnInit() {
    // TODO type this message!
    this.startQuizConnection = this.socketService.getStartQuizEvent().subscribe((message: any) => {
      console.log('QuizAdmin: start-quiz received', message);
      this.quizStarted = true;
    });
    this.stopQuizConnection = this.socketService.getStopQuizEvent().subscribe((message: any) => {
      console.log('QuizAdmin: stop-quiz received', message);
      this.quizStarted = false;
    });
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.startQuizConnection.unsubscribe();
    this.stopQuizConnection.unsubscribe();
  }

}
