import { Injectable } from '@angular/core';
//import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

// Services
import { FHService } from './fh.service';

// Sockets API
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  // Our localhost address that we set in our server code
  private url; 
  private socket;

  constructor(private fhService: FHService) {
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
      
      this.socket.on('question', (data) => {
        observer.next(data);   
      });

      return () => {
        this.socket.disconnect();
      }; 
    });

    return observable;
  } 
}