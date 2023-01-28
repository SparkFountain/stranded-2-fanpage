import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CombinationsComponent } from './combinations.component';

describe('CombinationsComponent', () => {
  let component: CombinationsComponent;
  let fixture: ComponentFixture<CombinationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
