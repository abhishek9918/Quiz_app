import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalQuizDashboardComponent } from './final-quiz-dashboard.component';

describe('FinalQuizDashboardComponent', () => {
  let component: FinalQuizDashboardComponent;
  let fixture: ComponentFixture<FinalQuizDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalQuizDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalQuizDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
