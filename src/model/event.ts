import { Agenda } from './agenda';
import { Quiz } from './quiz';

export class Event {
  id: string;
  adress: string;
  city: string;
  province: string;
  country: string;
  date: string;
  startTime: string;
  endTime: string;
  quiz: Quiz;
  agenda: Agenda;
}