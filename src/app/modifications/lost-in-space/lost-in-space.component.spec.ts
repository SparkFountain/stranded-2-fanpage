import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LostInSpaceComponent } from './lost-in-space.component';

describe('LostInSpaceComponent', () => {
  let component: LostInSpaceComponent;
  let fixture: ComponentFixture<LostInSpaceComponent>;

  beforeEach(waitForAsync(() => {
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
