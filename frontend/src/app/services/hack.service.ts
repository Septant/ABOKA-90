import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class HackService {
  fixedState$ = new BehaviorSubject(true);

  constructor(private dataService: DataService) {}

  switchFix() {
    this.fixedState$.next(!this.fixedState$.value);
  }

  dropDB() {
    (window as any).api
      .dropDB()
      .then(() => this.dataService.updateDataTrigger$.next());
  }
}
