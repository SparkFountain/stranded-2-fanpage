import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TipsTutorialsComponent } from './tips-tutorials.component';

describe('TipsTutorialsComponent', () => {
  let component: TipsTutorialsComponent;
  let fixture: ComponentFixture<TipsTutorialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TipsTutorialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsTutorialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
