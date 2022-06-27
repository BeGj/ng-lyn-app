import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LynEvent } from '../models/lyn-event.model';

@Injectable({
  providedIn: 'root'
})
export class LynMetService {
  protected eventStreamUrl = 'https://lyn.met.no/events';
  constructor() {}

  getServerSentEvent(): Observable<LynEvent[]> {
    return new Observable<LynEvent[]>(subscriber => {
      const ess = new EventSource(this.eventStreamUrl);

      ess.onerror = e => subscriber.error(e);

      ess.addEventListener('lx', e => {
        const message = e.data as string;
        const splitMessage =  message.split(/\r?\n/);
        console.log(splitMessage);
        const datas = splitMessage.map(data => JSON.parse(data) as LynEvent[] )

        subscriber.next(
          datas.flat()
        );
      })

      return () => {
        if (ess.readyState === 1) {
          ess.close();
        }
      };

    });
  }


}
