import { Injectable } from '@angular/core';

import * as Immutable from 'immutable';

import { Event } from '../model/event';
import { LiveQuiz } from '../model/live-quiz';

@Injectable()
export class StateService {
  state = Immutable.Map({
    username: null,
    department: null,
    eventId: null,
    quizId: null,
    events: null,
    liveQuiz: null,
    userRoles: null
  });
  
  getUsername() {
    return this.state.get('username');
  }

  getDepartment() {
    return this.state.get('department');
  }

  getEvents() {
    return this.state.get('events');
  }

  getEventId() {
    return this.state.get('eventId');
  }

  getQuizId() {
    return this.state.get('quizId');
  }

  getLiveQuiz() {
    return this.state.get('liveQuiz');
  }

  getUserRoles() {
    return this.state.get('userRoles');
  }

  updateUsername(username: string) {
    this.state = this.state.merge({ username: username });
  }

  updateDepartment(department: string) {
    this.state = this.state.merge({ department: department });
  }

  updateEvents(events: Event[]) {
    this.state = this.state.merge({ events: events });
  }

  updateEventId(eventId: string) {
    this.state = this.state.merge({ eventId: eventId });
  }

  updateQuizId(quizId: string) {
    this.state = this.state.merge({ quizId: quizId });
  }

  updateLiveQuiz(liveQuiz: LiveQuiz) {
    this.state = this.state.merge({ liveQuiz: liveQuiz });
  }

  updateUserRoles(userRoles: string[]) {
    this.state = this.state.merge({ userRoles: userRoles });
  }
}