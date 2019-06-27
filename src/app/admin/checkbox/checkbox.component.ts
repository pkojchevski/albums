import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements OnInit {
  value: boolean;
  @Output() valueChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() { }

  genericChange(event) {
    this.value = true;
    this.valueChanged.emit(this.value);
  }

  nonGenericChange(event) {
    this.value = false;
    this.valueChanged.emit(this.value);
  }
}
