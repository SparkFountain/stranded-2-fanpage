import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadContentComponent } from './download-content.component';

describe('DownloadContentComponent', () => {
  let component: DownloadContentComponent;
  let fixture: ComponentFixture<DownloadContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
