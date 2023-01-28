import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScriptingComponent } from './scripting.component';

describe('ScriptingComponent', () => {
  let component: ScriptingComponent;
  let fixture: ComponentFixture<ScriptingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
