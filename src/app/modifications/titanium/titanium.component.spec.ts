import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TitaniumComponent } from './titanium.component';

describe('TitaniumComponent', () => {
  let component: TitaniumComponent;
  let fixture: ComponentFixture<TitaniumComponent>;

  beforeEach(waitForAsync(() => {
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
