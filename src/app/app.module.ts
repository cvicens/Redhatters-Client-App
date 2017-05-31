import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { QuizComponent } from '../components/quiz.component';
import { QuizAdminComponent } from '../components/quiz-admin.component';
import { AgendaComponent } from '../components/agenda.component';

import { LoginPage } from '../pages/login/login';

import { AgendaPage } from '../pages/agenda/agenda';
import { AboutPage } from '../pages/about/about';
import { QuizPage } from '../pages/quiz/quiz';
import { QuizAdminPage } from '../pages/quiz-admin/quiz-admin';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Services
import { StateService } from '../services/state.service';
import { SocketService } from '../services/socket.service';
import { FHService } from '../services/fh.service';

@NgModule({
  declarations: [
    MyApp,
    QuizComponent,
    QuizAdminComponent,
    AgendaComponent,
    LoginPage,
    QuizPage,
    QuizAdminPage,
    AgendaPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    QuizComponent,
    QuizAdminComponent,
    AgendaComponent,
    LoginPage,
    QuizPage,
    QuizAdminPage,
    AgendaPage,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    StateService, SocketService, FHService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
