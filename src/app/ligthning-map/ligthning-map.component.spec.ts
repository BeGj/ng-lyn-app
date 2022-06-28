import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigthningMapComponent } from './ligthning-map.component';

describe('LigthningMapComponent', () => {
  let component: LigthningMapComponent;
  let fixture: ComponentFixture<LigthningMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LigthningMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigthningMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
