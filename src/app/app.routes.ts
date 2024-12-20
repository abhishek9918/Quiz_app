import { Routes } from '@angular/router';
import { FinalQuizDashboardComponent } from './final-quiz-dashboard/final-quiz-dashboard.component';
// import { QuestionComponent } from './question-start/question/question.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { QuestionComponent } from './Quiz/question/question.component';
import { QuestionStartComponent } from './question-start/question-start.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'quiz-start',
        pathMatch: 'full',
      },
      {
        path: 'quiz-start',
        component: QuestionStartComponent,
      },
      {
        path: 'quistion',
        component: QuestionComponent,
      },
      {
        path: 'quistion/:id',
        component: QuestionComponent,
      },
      {
        path: 'result',
        component: FinalQuizDashboardComponent,
      },
    ],
  },
];

//  {
//     path: '',
//     component: QuestionComponent,
//     children: [
//       {
//         path: 'result',
//         component: FinalQuizDashboardComponent,
//       },
//     ],
//   },
