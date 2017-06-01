import { Component, Input, OnInit, OnDestroy } from '@angular/core';

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
  //providers: [SocketService, FHService]
})
export class QuizComponent implements OnInit, OnDestroy {
  liveQuiz: LiveQuiz;

  pastQuestions = [];
  currentQuestion;
  currentQuestionIndex: number = -1;
  currentAnswer: number = -1;
  message;
  questionsConnection;
  startQuizConnection;
  stopQuizConnection;

  constructor(private socketService: SocketService, private fhService: FHService, private stateService: StateService) {
    
  }

  sendMessage(){
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

  submitAnswer() {
    this.fhService.submitAnswer(
      this.stateService.getEventId(), 
      this.stateService.getQuizId(), 
      this.stateService.getUsername(), 
      this.currentQuestionIndex, 
      this.currentAnswer)
    .then((response) => {
      console.log('submitAnswer response', response);
    })
    .catch( (err) => {
      console.log(err);
      this.message = JSON.stringify(err);
    });

    this.currentQuestion.submittedAnswer = this.currentAnswer;
    this.pastQuestions[this.currentQuestionIndex].submittedAnswer = this.currentAnswer;
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

    this.fhService.getLiveQuizById(eventId, quizId)
    .then( (liveQuiz) => {
      this.stateService.updateLiveQuiz(liveQuiz);
      this.liveQuiz = liveQuiz;
      this.currentQuestionIndex = this.liveQuiz.currentQuestionIndex;
      this.pastQuestions = this.liveQuiz.quiz ? this.liveQuiz.quiz.questions.slice(0, this.currentQuestionIndex + 1) : [];
      this.currentQuestion = this.liveQuiz.quiz.questions[this.currentQuestionIndex];
    })
    .catch( (err) => {
      console.log(err);
      this.message = JSON.stringify(err);
    });

  }

  // Let's subscribe our Observable
  ngOnInit() {
    this.getLiveQuizById(this.stateService.getEventId(), this.stateService.getQuizId());

    console.log('=====> this.quiz', this.liveQuiz);

    // TODO type this message!
    this.questionsConnection = this.socketService.getQuestions().subscribe((message: any) => {
      console.log('Quiz: new question received', message);
      this.pastQuestions.push(message.question);
      this.currentQuestion = message.question;
      this.currentQuestionIndex = message.currentQuestionIndex;
      this.currentAnswer = -1;
    });

    // TODO type this message!
    this.startQuizConnection = this.socketService.getStartQuizEvent().subscribe((message: any) => {
      console.log('Quiz: start quiz received', message);
      this.pastQuestions.push(message.question);
      this.currentQuestion = message.question;
      this.currentQuestionIndex = message.currentQuestionIndex;
      this.currentAnswer = -1;
    });

    // TODO type this message!
    this.stopQuizConnection = this.socketService.getStopQuizEvent().subscribe((message: any) => {
      console.log('Quiz: stop quiz received', message);
      this.pastQuestions = [];
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

  ngAfterViewInit () {
    //console.log('>>>>>>>>>>> ' + this.quiz);
  }
}
