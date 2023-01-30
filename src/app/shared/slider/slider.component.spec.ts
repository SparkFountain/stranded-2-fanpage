import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrandedSliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: StrandedSliderComponent;
  let fixture: ComponentFixture<StrandedSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrandedSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrandedSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
