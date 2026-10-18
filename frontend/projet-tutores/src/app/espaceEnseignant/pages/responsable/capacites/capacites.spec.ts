import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Capacites } from './capacites';

describe('Capacites', () => {
  let component: Capacites;
  let fixture: ComponentFixture<Capacites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Capacites],
    }).compileComponents();

    fixture = TestBed.createComponent(Capacites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
