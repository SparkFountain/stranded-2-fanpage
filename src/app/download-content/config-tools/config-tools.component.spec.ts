import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigToolsComponent } from './config-tools.component';

describe('ConfigToolsComponent', () => {
  let component: ConfigToolsComponent;
  let fixture: ComponentFixture<ConfigToolsComponent>;

  beforeEach(async(() => {
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
