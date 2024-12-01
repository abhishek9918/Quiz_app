import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { QuestionComponent } from './Quiz/question/question.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgApexchartsModule,
    SidebarComponent,
    HttpClientModule,
    QuestionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  title = 'task';
  constructor(private http: HttpClient) {
    this.chartOptions = {
      series: [
        {
          name: 'My-series',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      title: {
        text: 'My First Angular Chart',
      },
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
        ],
      },
    };
  }
  ngOnInit(): void {}
  ngOnDestroy(): void {}
}
