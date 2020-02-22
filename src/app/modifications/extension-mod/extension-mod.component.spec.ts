import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtensionModComponent } from './extension-mod.component';

describe('ExtensionModComponent', () => {
  let component: ExtensionModComponent;
  let fixture: ComponentFixture<ExtensionModComponent>;

  beforeEach(async(() => {
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
