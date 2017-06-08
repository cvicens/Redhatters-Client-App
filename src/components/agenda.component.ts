import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Agenda } from '../model/agenda';
import { Day } from '../model/day';
import { Segment } from '../model/segment';
import { Session } from '../model/session';

// Services
import { SocketService } from '../services/socket.service';
import { FHService } from '../services/fh.service';

@Component({
  selector: 'agenda',
  templateUrl: './agenda.component.html',
  //providers: [SocketService, FHService]
})
export class AgendaComponent implements OnInit, OnDestroy {
  @Input() agenda: Agenda = new Agenda([new Day (1, [new Segment(1111, [new Session("", 1, "", "", "", "", "", true, true, 1, "")])])]);
  @Input() title: string = 'No title';

  constructor(public navCtrl: NavController) {
    
  }

  // Init component
  ngOnInit() {
    console.log(this.title, this.agenda);
  }

  // Let's unsubscribe our Observable
  ngOnDestroy() {
  }

}
