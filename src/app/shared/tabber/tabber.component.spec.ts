import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabberComponent } from './tabber.component';

describe('TabberComponent', () => {
  let component: TabberComponent;
  let fixture: ComponentFixture<TabberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
