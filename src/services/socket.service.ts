import { Injectable } from '@angular/core';
//import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// Services
import { FHService } from './fh.service';

// Sockets API
import * as io from 'socket.io-client';

// Messages
var START_QUIZ_MESSAGE    = 'start-quiz';
var START_QUIZ_OK_MESSAGE = 'start-quiz-ok';
var START_QUIZ_KO_MESSAGE = 'start-quiz-ko';
var STOP_QUIZ_MESSAGE     = 'stop-quiz';
var STOP_QUIZ_OK_MESSAGE  = 'stop-quiz-ok';
var STOP_QUIZ_KO_MESSAGE  = 'stop-quiz-ko';
var NEXT_QUESTION_MESSAGE = 'next-question';
var NEW_QUESTION_MESSAGE  = 'new-question';

@Injectable()
export class SocketService {
  // Our localhost address that we set in our server code
  private url; 
  private socket;

  constructor(private fhService: FHService) {
    console.log('New SocketService!!!!');
    this.url = this.fhService.getUrl();
    //this.url = "http://localhost:8001";
    this.socket = io(this.url);
  }

  sendMessage(message){
    // Make sure the "add-message" is written here because this is referenced in on() in our server
    this.socket.emit('add-message', message);   
  }

  getQuestions() {
    let observable = new Observable(observer => {
      
      this.socket.on(NEW_QUESTION_MESSAGE, (data) => {
        observer.next(data);   
      });

      return () => {
        //this.socket.disconnect();
        // So if unsubcribed... no more calling next... we don't close the socket because we need it for other subscribers
        this.socket.on(NEW_QUESTION_MESSAGE, (data) => {
          ;   
        });
      }; 
    });

    return observable;
  }

  getStartQuizEvent() {
    let observable = new Observable(observer => {
      
      this.socket.on(START_QUIZ_OK_MESSAGE, (data) => {
        observer.next(data);   
      });

      return () => {
        //this.socket.disconnect();
        // So if unsubcribed... no more calling next... we don't close the socket because we need it for other subscribers
        this.socket.on(START_QUIZ_OK_MESSAGE, (data) => {
          ;   
        });
      }; 
    });

    return observable;
  }

  getStopQuizEvent() {
    let observable = new Observable(observer => {
      
      this.socket.on(STOP_QUIZ_OK_MESSAGE, (data) => {
        observer.next(data);   
      });

      return () => {
        //this.socket.disconnect();
        // So if unsubcribed... no more calling next... we don't close the socket because we need it for other subscribers
        this.socket.on(STOP_QUIZ_OK_MESSAGE, (data) => {
          ;   
        });
      }; 
    });

    return observable;
  }

  startQuiz = (eventId: string, quizId: string) => {
    this.socket.emit(START_QUIZ_MESSAGE, {eventId: eventId, quizId: quizId});   
  }

  stopQuiz = (eventId: string, quizId: string) => {
    this.socket.emit(STOP_QUIZ_MESSAGE, {eventId: eventId, quizId: quizId});   
  }

  nextQuestion = (eventId: string, quizId: string) => {
    this.socket.emit(NEXT_QUESTION_MESSAGE, {eventId: eventId, quizId: quizId});   
  }
}