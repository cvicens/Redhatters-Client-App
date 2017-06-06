import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavController } from 'ionic-angular';

// Tabs
import { TabsPage } from '../tabs/tabs';

// Services (they have to be added to the providers array in ../../app.component.ts)
import { FHService } from '../../services/fh.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  //styleUrls: ['./login.scss']
})
export class LoginPage {
  loginForm: FormGroup;
  submitAttempt: boolean;

  message: string = '';

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private fhService: FHService, private stateService: StateService) {
    this.loginForm = formBuilder.group({
        username: ['', Validators.compose([Validators.required])],
        department: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required])]
    });
  }

  login () {
    this.submitAttempt = true;
 
    if(this.loginForm.valid){
      console.log('Before calling hello endpoint with', this.loginForm.value);

      this.message = 'Before calling...';

      this.fhService.login(this.loginForm.value.username, this.loginForm.value.password)
      .then( (result) => {
        // Lets update the state of the app...
        this.stateService.updateUsername(this.loginForm.value.username);
        this.stateService.updateDepartment(this.loginForm.value.department);
        this.stateService.updateUserRoles(result.roles);
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

}
