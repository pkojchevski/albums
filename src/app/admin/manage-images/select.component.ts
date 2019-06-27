import {
  Component, OnInit, Input, EventEmitter, Output,
  ViewContainerRef, NgZone, TemplateRef, EmbeddedViewRef, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import Popper from 'popper.js';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})

export class SelectComponent implements OnInit, OnDestroy {
  @Input() labelKey: string;
  @Input() idKey: string;
  @Input() options = [];

  @Input() model = [];
  @Input() optionTpl: TemplateRef<any>;

  @Output() selectChange = new EventEmitter();
  @Output() closed = new EventEmitter();

  searchControl = new FormControl();
  visibleOptions = 4;

  private view: EmbeddedViewRef<any>;
  private popperRef: Popper;
  private originalOptions = [];

  constructor(private vcr: ViewContainerRef,
    private zone: NgZone, private cdr: ChangeDetectorRef) { }

  get isOpen() {
    return !!this.popperRef;
  }

  open(dropdownTpl: TemplateRef<any>, origin: HTMLElement) {
    this.view = this.vcr.createEmbeddedView(dropdownTpl);
    const dropdown = this.view.rootNodes[0];

    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.offsetWidth}px`;

    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, { removeOnDestroy: true });
    });
  }

  ngOnInit() {
    this.originalOptions = [...this.options];
    if (this.model !== undefined) {
      this.model = this.options.find(currOpt => currOpt[this.idKey] === this.model);
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        untilDestroyed(this)
      )
      .subscribe(term => this.search(term));
  }

  get label() {
    return this.model ? this.model[this.labelKey] : `---${this.labelKey}---`;
  }

  select(option) {
    this.model = option;
    this.selectChange.emit(option);
    this.close();
  }

  isActive(option) {
    if (!this.model) {
      return false;
    }

    return option[this.idKey] === this.model[this.idKey];
  }

  search(value: string) {
    this.options = this.originalOptions.filter(option => option[this.labelKey].includes(value));

    requestAnimationFrame(() => (this.visibleOptions = this.options.length || 1));
  }


  close() {
    this.closed.emit();
    this.popperRef.destroy();
    this.view.destroy();
    // this.searchControl.patchValue('');
    this.view = null;
    this.popperRef = null;
  }

  private handleClickOutside() {
    fromEvent(document, 'click')
      .pipe(
        filter(({ target }) => {
          const origin = this.popperRef.reference as HTMLElement;
          return origin.contains(target as HTMLElement) === false;
        }),
        takeUntil(this.closed)
      )
      .subscribe(() => {
        this.close();
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() { }


}

