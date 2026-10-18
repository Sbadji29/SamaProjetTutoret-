import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraitementCandidatures } from './traitement-candidatures';

describe('TraitementCandidatures', () => {
  let component: TraitementCandidatures;
  let fixture: ComponentFixture<TraitementCandidatures>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraitementCandidatures],
    }).compileComponents();

    fixture = TestBed.createComponent(TraitementCandidatures);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
