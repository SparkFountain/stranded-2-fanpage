import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsTutorialsComponent } from './tips-tutorials.component';

describe('TipsTutorialsComponent', () => {
  let component: TipsTutorialsComponent;
  let fixture: ComponentFixture<TipsTutorialsComponent>;

  beforeEach(async(() => {
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
