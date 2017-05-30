import { Component, OnInit, OnDestroy } from '@angular/core';

// Services
import { SocketService } from '../services/socket.service';
import { FHService } from '../services/fh.service';

@Component({
  selector: 'quiz',
  templateUrl: './quiz.component.html',
  providers: [SocketService, FHService]
})
export class QuizComponent implements OnInit, OnDestroy {
  questions = [];
  message;
  lastQuestion;
  connection;

  constructor(private socketService: SocketService) {

  }

  sendMessage(){
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

  // Let's subscribe our Observable
  ngOnInit() {
    this.connection = this.socketService.getQuestions().subscribe(question => {
      this.questions.push(question);
      this.lastQuestion = question;
    })
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
    this.connection.unsubscribe();
  }

}
