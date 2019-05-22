import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomAlbumsComponent } from './random-albums.component';

describe('RandomAlbumsComponent', () => {
  let component: RandomAlbumsComponent;
  let fixture: ComponentFixture<RandomAlbumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomAlbumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
