import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnseignantLayout } from './enseignant-layout';

describe('EnseignantLayout', () => {
  let component: EnseignantLayout;
  let fixture: ComponentFixture<EnseignantLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnseignantLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(EnseignantLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
