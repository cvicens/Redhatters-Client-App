import { Component } from '@angular/core';

import { AgendaPage } from '../agenda/agenda';
import { HomePage } from '../home/home';
import { QuizPage } from '../quiz/quiz';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  //tab1Root: any = HomePage;
  tab1Root: any = AgendaPage;
  tab2Root: any = QuizPage;
  tab3Root: any = ContactPage;

  constructor() {

  }
}
