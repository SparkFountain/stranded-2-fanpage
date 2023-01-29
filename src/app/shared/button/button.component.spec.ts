import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrandedButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: StrandedButtonComponent;
  let fixture: ComponentFixture<StrandedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrandedButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrandedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
