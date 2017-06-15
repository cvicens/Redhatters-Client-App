import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/Rx";

import * as Immutable from 'immutable';

// Services
import { SocketService } from './socket.service';
import { FHService } from './fh.service';

// Model
import { Event } from '../model/event';
import { LiveQuiz } from '../model/live-quiz';
import { Question } from '../model/question';

@Injectable()
export class StateService implements OnInit, OnDestroy {
  private _liveQuiz: BehaviorSubject<LiveQuiz> = new BehaviorSubject(new LiveQuiz(-1, null));
  public readonly liveQuiz: Observable<LiveQuiz> = this._liveQuiz.asObservable();

  private _currentQuestionIndex: BehaviorSubject<number> = new BehaviorSubject(-1);
  public readonly currentQuestionIndex: Observable<number> = this._currentQuestionIndex.asObservable();

  private _pastQuestions: BehaviorSubject<Array<Question>> = new BehaviorSubject(new Array<Question>());
  public readonly pastQuestions: Observable<Array<Question>> = this._pastQuestions.asObservable();

  private _currentQuestion: BehaviorSubject<Question> = new BehaviorSubject(new Question());
  public readonly currentQuestion: Observable<Question> = this._currentQuestion.asObservable();

  private _currentAnswer: BehaviorSubject<number> = new BehaviorSubject(-1);
  public readonly currentAnswer: Observable<number> = this._currentAnswer.asObservable();

  // Sockets
  questionsConnection;
  startQuizConnection;
  stopQuizConnection;

  state = Immutable.Map({
    username: null,
    department: null,
    eventId: null,
    quizId: null,
    events: null,
    event: null,
    liveQuiz: null,
    userRoles: null
  });
  
  constructor(private fhService: FHService, private socketService: SocketService) {
    console.log('New StateService!!!!');
    this.socketService.ready.subscribe(ready => {
      if (ready) {
        this.initSockets();
      }
    });
  }

  ngOnInit() {
    console.log('StateService->ngOnInit()');
    
  }

  // Let's subscribe our Observable sockets
  initSockets() {
    console.log('StateService->initSockets()');
    
    // Start quiz message
    this.startQuizConnection = this.socketService.getStartQuizEvent().subscribe((message: any) => {
      // TODO type this message!
      console.log('StateService: start quiz received', message);
      this.fetchLiveQuiz(this.getEventId(), this.getQuizId());
    });

    // Get questions as they are released
    this.questionsConnection = this.socketService.getQuestions().subscribe((message: any) => {
      // TODO type this message!
      console.log('StateService: new question received', message);
      
      this._pastQuestions.getValue().push(message.question);

      this._pastQuestions.next(this._pastQuestions.getValue());
      this._currentQuestion.next(message.question);
      this._currentQuestionIndex.next(message.currentQuestionIndex);
      this._currentAnswer.next(-1);
    });

    // Stop quiz message
    this.stopQuizConnection = this.socketService.getStopQuizEvent().subscribe((message: any) => {
      // TODO type this message!
      console.log('StateService : stop quiz received', message);
      this._pastQuestions.next(new Array<Question>());
      this._currentQuestion.next(null);
      this._currentQuestionIndex.next(-1);
      this._currentAnswer.next(-1);
    });
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.questionsConnection.unsubscribe();
    this.startQuizConnection.unsubscribe();
    this.stopQuizConnection.unsubscribe();
  }

  fetchLiveQuiz(eventId: string, quizId: string) {
    console.log('Before calling getQuizById endpoint');

    this.fhService.getLiveQuizById(eventId, quizId)
    .then( (liveQuiz) => {
      this._liveQuiz.next(liveQuiz);

      this._currentQuestionIndex.next(liveQuiz.currentQuestionIndex);
      this._pastQuestions.next(liveQuiz.quiz && liveQuiz.quiz.questions ? liveQuiz.quiz.questions.slice(0, this._currentQuestionIndex.getValue() + 1) : []);
      this._currentQuestion.next(liveQuiz.quiz.questions[this._currentQuestionIndex.getValue()]);
    })
    .catch( (err) => {
      console.log(err);
    });
  }

  submitAnswerForCurrentQuestion(answer: number) {
    this.fhService.submitAnswer(
      this.getEventId(), 
      this.getQuizId(), 
      this.getUsername(), 
      this.getDepartment(), 
      this._currentQuestionIndex.getValue(), 
      answer)
    .then((response) => {
      console.log('submitAnswer response', response);
      this._currentQuestion.getValue().submittedAnswer = answer;
      this._currentQuestion.next(this._currentQuestion.getValue());
      this._pastQuestions.getValue()[this._currentQuestionIndex.getValue()].submittedAnswer = answer;
      this._pastQuestions.next(this._pastQuestions.getValue());
    })
    .catch( (err) => {
      console.log(err);
    });
  }

  getUsername() {
    return this.state.get('username');
  }

  getDepartment() {
    return this.state.get('department');
  }

  getEvents() {
    return this.state.get('events');
  }

  getEvent() {
    return this.state.get('event');
  }

  getHashtag() {
    return this.state.get('hashtag');
  }

  getEventId() {
    return this.state.get('eventId');
  }

  getQuizId() {
    return this.state.get('quizId');
  }

  getLiveQuiz() {
    return this.state.get('liveQuiz');
  }

  getUserRoles() {
    return this.state.get('userRoles');
  }

  updateUsername(username: string) {
    this.state = this.state.merge({ username: username });
  }

  updateDepartment(department: string) {
    this.state = this.state.merge({ department: department });
  }

  updateEvents(events: Event[]) {
    this.state = this.state.merge({ events: events });
  }

  updateEvent(events: Event) {
    this.state = this.state.merge({ event: event });
  }

  updateHashtag(hashtag: string) {
    this.state = this.state.merge({ hashtag: hashtag });
  }

  updateEventId(eventId: string) {
    this.state = this.state.merge({ eventId: eventId });
  }

  updateQuizId(quizId: string) {
    this.state = this.state.merge({ quizId: quizId });
  }

  updateLiveQuiz(liveQuiz: LiveQuiz) {
    this.state = this.state.merge({ liveQuiz: liveQuiz });
  }

  updateUserRoles(userRoles: string[]) {
    this.state = this.state.merge({ userRoles: userRoles });
  }
}