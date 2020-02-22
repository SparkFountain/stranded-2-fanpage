import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitaniumComponent } from './titanium.component';

describe('TitaniumComponent', () => {
  let component: TitaniumComponent;
  let fixture: ComponentFixture<TitaniumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitaniumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitaniumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
