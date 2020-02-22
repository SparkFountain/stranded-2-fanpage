import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatibilityComponent } from './compatibility.component';

describe('CompatibilityComponent', () => {
  let component: CompatibilityComponent;
  let fixture: ComponentFixture<CompatibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompatibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
