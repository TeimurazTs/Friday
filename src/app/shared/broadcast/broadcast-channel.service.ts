import { Injectable, InjectionToken, NgZone, Inject } from '@angular/core';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

interface BroadcastMessage {
  type: string;
  payload: string;
  message: string;
}

function runInZone<T>(zone: NgZone): OperatorFunction<T, T> {
  return (source) => {
    return new Observable((observer) => {
      const onNext = (value: T) => zone.run(() => observer.next(value));
      const onError = (e: any) => zone.run(() => observer.error(e));
      const onComplete = () => zone.run(() => observer.complete());
      return source.subscribe(onNext, onError, onComplete);
    });
  };
}

@Injectable({
  providedIn: 'root',
})
export class BroadcastChannelService {
  private broadcastChannel: BroadcastChannel;
  private onMessage = new Subject<BroadcastMessage>();

  constructor(@Inject('s') name: string, private ngZone: NgZone) {
    this.broadcastChannel = new BroadcastChannel(name);
    this.broadcastChannel.onmessage = (message) => {
      this.onMessage.next(message.data);
    };
  }

  publish(message: BroadcastMessage): void {
    this.broadcastChannel.postMessage(message);
  }

  messagesOfType(type: string): Observable<BroadcastMessage> {
    return this.onMessage.pipe(
      runInZone(this.ngZone),
      filter((message) => message.type === type)
    );
  }
}

export const BChannel = new InjectionToken<BroadcastChannelService>('', {
  factory: () => {
    return new BroadcastChannelService('BChannel', new NgZone({}));
  },
});
