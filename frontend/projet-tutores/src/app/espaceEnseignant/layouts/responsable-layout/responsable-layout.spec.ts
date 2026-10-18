import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsableLayout } from './responsable-layout';

describe('ResponsableLayout', () => {
  let component: ResponsableLayout;
  let fixture: ComponentFixture<ResponsableLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsableLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsableLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
