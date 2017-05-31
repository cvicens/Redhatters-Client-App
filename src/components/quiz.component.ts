import { Component, Input, OnInit, OnDestroy } from '@angular/core';

// Model
import { Quiz } from '../model/quiz';

// Services
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  //providers: [SocketService, FHService]
})
export class QuizComponent implements OnInit, OnDestroy {
  @Input() quiz: Quiz;

  questions = [];
  currentQuestion;
  currentQuestionIndex = -1;
  currentAnswer: number = -1;
  message;
  questionsConnection;
  startQuizConnection;
  stopQuizConnection;

  constructor(private socketService: SocketService) {
    this.questions = this.quiz ? this.quiz.questions : [];
  }

  sendMessage(){
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

  submitAnswer(){
    this.questions[this.currentQuestionIndex].submittedAnswer = this.currentAnswer;
  }

  currentAnswerSubmitted() {


    return typeof this.questions[this.currentQuestionIndex] !== 'undefined' &&
           typeof this.questions[this.currentQuestionIndex].submittedAnswer !== 'undefined';
  }

  answerReady(){
    return this.currentAnswer >= 0 && !this.currentAnswerSubmitted();
  }

  // Let's subscribe our Observable
  ngOnInit() {
    // TODO type this message!
    this.questionsConnection = this.socketService.getQuestions().subscribe((message: any) => {
      console.log('Quiz: new question received', message);
      this.questions.push(message.question);
      this.currentQuestion = message.question;
      this.currentQuestionIndex = message.currentQuestionIndex;
      this.currentAnswer = -1;
    });

    // TODO type this message!
    this.startQuizConnection = this.socketService.getStartQuizEvent().subscribe((message: any) => {
      console.log('Quiz: start quiz received', message);
      this.questions.push(message.question);
      this.currentQuestion = message.question;
      this.currentQuestionIndex = message.currentQuestionIndex;
      this.currentAnswer = -1;
    });

    // TODO type this message!
    this.stopQuizConnection = this.socketService.getStopQuizEvent().subscribe((message: any) => {
      console.log('Quiz: stop quiz received', message);
      this.questions = [];
      this.currentQuestion = null;
      this.currentQuestionIndex = -1;
      this.currentAnswer = -1;
    });
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.questionsConnection.unsubscribe();
    this.startQuizConnection.unsubscribe();
    this.stopQuizConnection.unsubscribe();
  }

}
