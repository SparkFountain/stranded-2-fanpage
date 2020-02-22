import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostInSpaceComponent } from './lost-in-space.component';

describe('LostInSpaceComponent', () => {
  let component: LostInSpaceComponent;
  let fixture: ComponentFixture<LostInSpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostInSpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostInSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
