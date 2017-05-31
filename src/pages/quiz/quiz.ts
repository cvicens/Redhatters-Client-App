import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { StateService } from '../../services/state.service';

// Model
import { Quiz } from '../../model/quiz';

@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html'
})
export class QuizPage {
  quiz: Quiz;
  message: string;

  constructor(public navCtrl: NavController, private fhService: FHService, private stateService: StateService) {

  }

  // 
  ngOnInit() {
    this.getQuizById(this.stateService.getEventId(), this.stateService.getQuizId());
  }

  // 
  ngOnDestroy() {
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
