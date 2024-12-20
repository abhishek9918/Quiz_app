import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-quiz-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './final-quiz-dashboard.component.html',
  styleUrl: './final-quiz-dashboard.component.scss',
})
export class FinalQuizDashboardComponent implements OnInit {
  constructor(private route: Router) {}
  data!: Result;
  ngOnInit(): void {
    const quizResults = localStorage.getItem('quizResults');

    if (quizResults) {
      this.data = JSON.parse(quizResults);
      console.log(this.data);
    }
  }
  get performance(): string {
    const accuracy =
      (this.data.correctAnswers / this.data.totalQuestions) * 100;

    if (accuracy >= 80) {
      return 'Excellent';
    } else if (accuracy >= 50) {
      return 'Moderate';
    } else {
      return 'Poor';
    }
  }
  reTakeQuiz() {
    this.route.navigate(['/quistion', this.data.Set]);
  }
  nextSet() {
    const set = this.data.Set == 'ONE' ? 'TWO' : 'ONE';
    this.route.navigate(['/quistion', set]);
  }
}

interface Result {
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattemptedQuestions?: number;
  Set: any;
}
