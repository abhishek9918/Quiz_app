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
  Set = 'ONE';
  ngOnInit(): void {
    this.getAllQuestion(this.Set);
  }
  UrlOne = 'https://opentdb.com/api.php?amount=20&category=21&type=multiple';
  UrlTwo =
    'https://opentdb.com/api.php?amount=20&category=18&difficulty=medium&type=multiple';
  getAllQuestion(Set: String) {
    const url = Set === 'ONE' ? this.UrlOne : this.UrlTwo;
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

  getNewQuestion() {}

  trackById(index: number, item: any): any {
    return item.id;
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
    console.log(currentQues, 'currrentQues');
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
    console.log('click--Index');
    this.optionIndex = null;
    this.optionIndex = selectedIndex;
    console.log(this.optionIndex);

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
      console.log(this.marks, 'makrs');
    }
  }
  count = 15;

  getTimerInterVal() {
    const timer = interval(1000);
    this.timerSubs = timer.subscribe(() => {
      if (this.count > 0) {
        this.count--;
        this.progress = Math.trunc((this.count / 15) * 100);
      } else {
        this.timerSubs.unsubscribe();
        this.nextQuestion();
        this.optionClicked = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.timerSubs) {
      this.timerSubs.unsubscribe();
    }
  }

  showModal: boolean = false;
  showResult() {
    this.showModal = true;
  }
  closeModal() {
    this.showModal = false;
  }
  newSet(set: String) {
    this.showModal = false;
    this.currentIndex = 0;
    this.progress = 100;
    this.count = 15;
    this.optionIndex = null;
    this.marks = 0;
    this.optionClicked = false;

    this.getAllQuestion(set);
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
