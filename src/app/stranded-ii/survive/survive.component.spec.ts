import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurviveComponent } from './survive.component';

describe('SurviveComponent', () => {
  let component: SurviveComponent;
  let fixture: ComponentFixture<SurviveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurviveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurviveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
