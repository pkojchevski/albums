import {Injectable} from '@angular/core';
import {Subject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DroppableService {
  dragStart$: Observable<PointerEvent>;
  private dragStartSubject = new Subject<PointerEvent>();

  constructor() {
    this.dragStart$ = this.dragStartSubject.asObservable();
  }

  onDragStart(event: PointerEvent): void {
    this.dragStartSubject.next(event);
  }
}
