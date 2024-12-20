import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-start',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-start.component.html',
  styleUrl: './question-start.component.scss',
})
export class QuestionStartComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}

  startQuiz() {
    console.log('ll');
    // this.router.navigateByUrl('/quiz-start');
    this.router.navigateByUrl('/quistion');
  }
}
