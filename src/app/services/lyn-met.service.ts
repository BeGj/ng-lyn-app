import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Lyn, LynDto, lynDtoToLyn } from '../models/lyn-event.model';

@Injectable({
  providedIn: 'root'
})
export class LynMetService {
  protected eventStreamUrl = 'https://lyn.met.no/events';
  constructor(private http: HttpClient) { }

  getServerSentEvent(): Observable<Lyn[]> {
    return new Observable<Lyn[]>(subscriber => {
      const ess = new EventSource(this.eventStreamUrl);

      ess.onerror = e => subscriber.error(e);

      ess.addEventListener('lx', e => {
        const message = e.data as string;
        const splitMessage = message.split(/\r?\n/);
        // console.log(splitMessage);
        const datas = splitMessage.map(data => JSON.parse(data) as LynDto[])
        subscriber.next(
          datas.flat().map(dto => lynDtoToLyn(dto))
        );
      })

      return () => {
        if (ess.readyState === 1) {
          ess.close();
        }
      };

    });
  }

  getLynHistory(minutes: number): Observable<Lyn[]> {
    const sec = minutes * 60;
    const epochSecoundsStartTime = Math.floor(new Date().getTime() / 1000) - (sec);
    return this.http.get<LynDto[]>(`https://lyn.met.no/fetch/${epochSecoundsStartTime}/${sec}`).pipe(
      map(list => {
        return list.map(dto => lynDtoToLyn(dto))
      })
    );
  }


}
