import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrandedIiComponent } from './stranded-ii.component';

describe('StrandedIiComponent', () => {
  let component: StrandedIiComponent;
  let fixture: ComponentFixture<StrandedIiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StrandedIiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrandedIiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
