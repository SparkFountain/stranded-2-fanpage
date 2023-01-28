import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigToolsComponent } from './config-tools.component';

describe('ConfigToolsComponent', () => {
  let component: ConfigToolsComponent;
  let fixture: ComponentFixture<ConfigToolsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigToolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
