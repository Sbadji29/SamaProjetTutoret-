import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sujet } from './sujet';

describe('Sujet', () => {
  let component: Sujet;
  let fixture: ComponentFixture<Sujet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sujet],
    }).compileComponents();

    fixture = TestBed.createComponent(Sujet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
