import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModificationsComponent } from './modifications.component';

describe('ModificationsComponent', () => {
  let component: ModificationsComponent;
  let fixture: ComponentFixture<ModificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
