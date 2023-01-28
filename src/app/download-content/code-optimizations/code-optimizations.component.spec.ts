import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeOptimizationsComponent } from './code-optimizations.component';

describe('CodeOptimizationsComponent', () => {
  let component: CodeOptimizationsComponent;
  let fixture: ComponentFixture<CodeOptimizationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeOptimizationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeOptimizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
