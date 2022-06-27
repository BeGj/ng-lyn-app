import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LynEvent } from '../models/lyn-event.model';

@Injectable({
  providedIn: 'root'
})
export class LynMetService {
  protected eventStreamUrl = 'https://lyn.met.no/events';
  constructor(private http: HttpClient) {}

  getServerSentEvent(): Observable<LynEvent[]> {
    return new Observable<LynEvent[]>(subscriber => {
      const ess = new EventSource(this.eventStreamUrl);

      ess.onerror = e => subscriber.error(e);

      ess.addEventListener('lx', e => {
        const message = e.data as string;
        const splitMessage =  message.split(/\r?\n/);
        console.log(splitMessage);
        const datas = splitMessage.map(data => JSON.parse(data) as LynEvent[])
        subscriber.next(
          datas.flat().map(lyn => ({...lyn,Epoch: new Date(lyn.Epoch)}))
        );
      })

      return () => {
        if (ess.readyState === 1) {
          ess.close();
        }
      };

    });
  }

  getLynHistory(minutes: number): Observable<LynEvent[]> {
    const sec = minutes * 60;
    return this.http.get<LynEvent[]>(`https://lyn.met.no/fetch/1656336591/${sec}`).pipe(
      map(list => {
        return list.map(lyn => ({...lyn, Epoch: new Date(lyn.Epoch)}))
      })
    );
  }


}


export interface LynHistoryResponse {

}

export interface LynDetails extends LynEvent {
  // "Epoch":"2022-06-27T13:30:06.448702464Z","Point":[20.5903,68.6687],"CloudIndicator":1,"PeakCurrentEstimate":2,"Multiplicity":0,"SolutionNOfSensors":3,"LocationDegreesOfFreedom":3,"EllipseAngle":60.92,"EllipseSemiMajorAxis":0.4,"EllipseSemiMinorAxis":0.4,"ChiSquare":0.55,"RiseTime":6.8,"PeakToZeroTime":2.4,"MaxRateOfRise":1.3,"AngleIndicator":1,"SignalIndicator":0,"TimingIndicator":1
}
