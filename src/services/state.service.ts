import { Injectable } from '@angular/core';

import * as Immutable from 'immutable';

import { Event } from '../model/event';

@Injectable()
export class StateService {
  state = Immutable.Map({
    eventId: null,
    quizId: null,
    events: null
  });
  
  getEvents() {
    return this.state.get('events');
  }

  getEventId() {
    return this.state.get('eventId');
  }

  getQuizId() {
    return this.state.get('quizId');
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
}