import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalsPlantsComponent } from './animals-plants.component';

describe('AnimalsPlantsComponent', () => {
  let component: AnimalsPlantsComponent;
  let fixture: ComponentFixture<AnimalsPlantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimalsPlantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimalsPlantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
