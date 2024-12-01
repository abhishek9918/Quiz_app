import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { interval, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent implements OnInit {
  constructor(private http: HttpClient) {}
  questionArray: any[] = [];
  currentIndex: number = 0;
  timerSubs!: Subscription;
  optionClicked: boolean = false;
  progress: number = 100;
  ngOnInit(): void {
    this.getAllQuestion();
  }

  getAllQuestion() {
    const url =
      'https://opentdb.com/api.php?amount=20&category=21&type=multiple';
    this.http.get<any>(url).subscribe((response) => {
      this.questionArray = response.results;

      this.questionArray = this.questionArray.map((ques: any) => {
        const allOptions = [...ques.incorrect_answers, ques.correct_answer];

        this.shuffleOptions(allOptions);

        return {
          question: ques.question,
          options: allOptions,
          correct_answer: ques.correct_answer,
        };
      });
      this.displayQuestion();
      this.getTimerInterVal();
    });

    const quesObj = {
      question: this.questionArray.forEach((e: any) => e.question),
    };
  }

  shuffleOptions(options: any[]) {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
  }
  currentQuestion: any;

  displayQuestion(): any {
    const currentQues = this.questionArray[this.currentIndex];
    return currentQues;
  }

  nextQuestion() {
    this.timerSubs.unsubscribe();
    this.progress = 100;
    this.count = 15;
    this.optionIndex = null;
    if (this.currentIndex < this.questionArray.length - 1) {
      this.currentIndex++;
      this.displayQuestion();
      this.getTimerInterVal();
    } else if (this.currentIndex == this.questionArray.length - 1) {
      this.showModal = true;
    }
  }
  isClicked = false;
  optionIndex: any = null;
  marks: any = 0;

  verifyOption(selectedOption: any, selectedIndex: number) {
    this.optionIndex = '';
    this.optionIndex = selectedIndex;

    const correctAnswer = this.displayQuestion().correct_answer;

    const formattedCorrectAnswer =
      typeof correctAnswer === 'number'
        ? correctAnswer.toString()
        : correctAnswer;

    const formattedSelectedOption = selectedOption.toString();

    if (
      formattedSelectedOption.trim().toLowerCase() ===
      formattedCorrectAnswer.trim().toLowerCase()
    ) {
      this.updateScore(true);
    } else {
      this.updateScore(false);
    }

    this.optionClicked = true;
  }

  updateScore(isCorrect: boolean) {
    let score: any = document.getElementById('correctScore');
    if (isCorrect) {
      let sc = 100 / this.questionArray.length;
      this.marks += sc;
      if (this.currentIndex == 20) score.textContent = this.marks;
    }
  }
  count = 15;
  getTimerInterVal() {
    const timer = interval(1000);
    this.timerSubs = timer.subscribe((e) => {
      this.count--;
      this.progress = (this.count / 15) * 100;
      if (this.count === 0) {
        this.timerSubs.unsubscribe();
        this.count = 0;
        this.nextQuestion();
      }
    });
  }

  showModal: boolean = false; // Control modal visibility
  // marks: number = 0;

  // Call this function at the end of the quiz to show the modal
  showResult() {
    this.showModal = true;
  }

  // Close the modal
  closeModal() {
    this.showModal = false;
  }
}

interface Answer {
  answer: string;
  isCorrect?: boolean;
}

interface Question {
  question: string;
  options: Answer[];
  correct_answer: string;
}
