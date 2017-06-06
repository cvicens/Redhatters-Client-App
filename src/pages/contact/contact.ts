import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { StateService } from '../../services/state.service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  hashtag;

  constructor(public navCtrl: NavController, private stateService: StateService) {
    this.hashtag = this.stateService.getHashtag ();
  }

}
