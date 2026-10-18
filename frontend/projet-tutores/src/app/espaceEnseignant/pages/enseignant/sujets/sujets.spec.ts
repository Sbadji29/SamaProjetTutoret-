import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sujets } from './sujets';

describe('Sujets', () => {
  let component: Sujets;
  let fixture: ComponentFixture<Sujets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sujets],
    }).compileComponents();

    fixture = TestBed.createComponent(Sujets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
