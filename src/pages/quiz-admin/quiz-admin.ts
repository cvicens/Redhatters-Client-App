import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { StateService } from '../../services/state.service';

// Model
import { Quiz } from '../../model/quiz';

@Component({
  selector: 'page-quiz-admin',
  templateUrl: 'quiz-admin.html'
})
export class QuizAdminPage {
  quiz: Quiz;

  message: string;

  constructor(public navCtrl: NavController, private fhService: FHService, private stateService: StateService) {

  }

  // 
  ngOnInit() {
    //this.getQuizById(this.stateService.getQuizId());
    // Subscribe to stateService observables
    this.stateService.liveQuiz.subscribe(value => {
      setTimeout(() => {
      this.quiz = value.quiz; 
      console.log('🔥🔥🔥 Quiz Admin remove this logic... QuizAdmin: this.quiz', this.quiz);
      //this.cd.detectChanges();
      },0);
    });
  }

  // 
  ngOnDestroy() {
  }

  getQuizByIdOld(id: string) {
    console.log('Before calling getQuizById endpoint');

    this.message = 'Before calling...';

    this.fhService.getQuizById(id)
    .then( (quiz) => {
      this.quiz = quiz;
    })
    .catch( (err) => {
      console.log(err);
      this.message = JSON.stringify(err);
    });

  }
}
