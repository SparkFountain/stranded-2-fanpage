import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtensionModComponent } from './extension-mod.component';

describe('ExtensionModComponent', () => {
  let component: ExtensionModComponent;
  let fixture: ComponentFixture<ExtensionModComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtensionModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtensionModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
