import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// Tabs
import { TabsPage } from '../tabs/tabs';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  message: string = '';

  constructor(public navCtrl: NavController, private fhService: FHService, private stateService: StateService) {

  }

  login () {
    console.log('Before calling hello endpoint');

    this.message = 'Before calling...';

    this.fhService.login(this.username, this.password)
    .then( (result) => {
      // Lets update the state of the app...
      this.stateService.updateUsername(this.username);
      console.log('result', result);
      this.message = 'Login OK';
      this.navCtrl.setRoot(TabsPage);
    })
    .catch( (err) => {
      console.log(err);
      this.message = JSON.stringify(err);
    });

  }

}
