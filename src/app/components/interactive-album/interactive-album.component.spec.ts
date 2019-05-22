import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveAlbumComponent } from './interactive-album.component';

describe('InteractiveAlbumComponent', () => {
  let component: InteractiveAlbumComponent;
  let fixture: ComponentFixture<InteractiveAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractiveAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
