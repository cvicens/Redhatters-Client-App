import { Injectable } from '@angular/core';

import * as Immutable from 'immutable';

import { Event } from '../model/event';
import { LiveQuiz } from '../model/live-quiz';

@Injectable()
export class StateService {
  state = Immutable.Map({
    username: null,
    eventId: null,
    quizId: null,
    events: null,
    liveQuiz: null
  });
  
  getUsername() {
    return this.state.get('username');
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

  updateUsername(username: string) {
    this.state = this.state.merge({ username: username });
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
}