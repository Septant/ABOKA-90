import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HackService {
  fixedState$ = new BehaviorSubject(true);

  switchFix() {
    this.fixedState$.next(!this.fixedState$.value);
  }
}
