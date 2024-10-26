import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CsvLoaderService } from '../service/csv-loader.service';
import { CommonModule } from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { FormsModule } from '@angular/forms';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { from, take, toArray } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend?: { show: boolean; position: 'top' | 'right' | 'bottom' | 'left' };
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  colors?: string[];
  tooltip?: { enabled: boolean };
  legend?: { show: boolean; position: 'top' | 'right' | 'bottom' | 'left' };
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgApexchartsModule,
    FormsModule,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedItems = [];
  evData: any[] = [];
  manufacturerData: { [key: string]: number } = {};
  evTypeData: { [key: string]: number } = {};
  yearWiseData: { [key: string]: number } = {};

  yearChartOptions: Partial<ChartOptions> | null = null;
  chartOptions: Partial<ChartOptions> | null = null;
  pieChartOptions: Partial<PieChartOptions> | null = null;

  items: any[] = [];
  allItems: any[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 5;
  loading: boolean = false;
  loadingMore: boolean = false;
  errorMessage: string = '';
  searchText: string = '';

  @ViewChild('chart') chart!: ChartComponent;

  constructor(private csvLoaderService: CsvLoaderService) {}
  dropdownSettings: IDropdownSettings = {};
  filterOptions: any[] = [];
  selectedFilters: any[] = [];
  dropdownList: any[] = [];
  ngOnInit(): void {
    this.displayCsvData();
    setTimeout(() => {
      this.initializeDropdownSettings();
    }, 500);
  }

  ngOnDestroy(): void {}

  displayCsvData(): void {
    this.csvLoaderService
      .loadCsvData('../../assets/Electric_Vehicle_Population_Data.csv')
      .subscribe(
        (data) => {
          this.allItems = data;
          this.evData = data;

          this.extractFilterOptions();
          this.prepareManufacturerData();
          this.prepareEvTypeData();
          this.prepareYearWiseData();
          this.initializeChartOptions();
          this.initializePieChartOptions();
          this.fetchData();
          this.errorMessage = '';
        },
        (error) => {
          console.error('Error loading CSV data:', error);
          this.errorMessage = 'Failed to load data. Please try again later.';
        }
      );
  }

  extractFilterOptions(): void {
    const yrs = new Set(this.evData.map((item) => item['Model Year']));
    const st = new Set(this.evData.map((item) => item.State));
    const evT = new Set(
      this.evData.map((item) => item['Electric Vehicle Type'])
    );

    const list = [
      ...Array.from(yrs).map((year) => ({
        itemName: year,
        id: year,
        type: 'year',
        value: year,
      })),
      ...Array.from(st).map((state) => ({
        itemName: state,
        id: state,
        type: 'state',
        value: state,
      })),
      ...Array.from(evT).map((type) => ({
        itemName: type,
        id: type,
        type: 'evType',
        value: type,
      })),
    ];
    this.dropdownList = list;

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true,
    };
    console.log(this.dropdownList, 'dropdownList');
  }

  initializeDropdownSettings(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'itemName',
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    console.log(this.dropdownSettings);
  }

  onItemSelect(item: any): void {}

  onSelectAll(items: any): void {}

  onItemDeselect(item: any): void {}

  onDeselectAll(items: any): void {}

  fetchData() {
    this.loadingMore = true;
    setTimeout(() => {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.items = [...this.items, ...this.allItems.slice(start, end)];
      this.loading = false;
      this.loadingMore = false;
    }, 1000);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !this.loading
    ) {
      this.currentPage++;
      this.fetchData();
    }
  }

  prepareManufacturerData(): void {
    this.manufacturerData = this.evData.reduce(
      (acc: { [key: string]: number }, curr: any) => {
        const manufacturer = curr.Make || 'Unknown';
        acc[manufacturer] = (acc[manufacturer] || 0) + 1;
        return acc;
      },
      {}
    );
  }

  prepareEvTypeData(): void {
    this.evTypeData = this.evData.reduce(
      (acc: { [key: string]: number }, curr: any) => {
        const evType = curr['Electric Vehicle Type'] || 'Unknown';
        acc[evType] = (acc[evType] || 0) + 1;
        return acc;
      },
      {}
    );
  }

  initializeChartOptions(): void {
    const categories = Object.keys(this.manufacturerData);
    const data = Object.values(this.manufacturerData) as number[];

    this.chartOptions = {
      series: [
        {
          name: 'EV Count',
          data: data,
        },
      ],
      chart: { type: 'bar', height: 400 },
      title: { text: 'EVs by Manufacturer' },
      xaxis: { categories },
      dataLabels: { enabled: false },

      colors: ['#008FFB'],
      tooltip: {
        shared: true,
        intersect: false,
      },
      legend: {
        show: true,
        position: 'bottom',
      },
    };
  }

  initializePieChartOptions(): void {
    const labels = Object.keys(this.evTypeData);
    const data = Object.values(this.evTypeData) as number[];

    this.pieChartOptions = {
      series: data,
      chart: { type: 'pie', height: 400 },
      labels: labels,
      title: { text: 'EVs by Type' },
      dataLabels: { enabled: true },
      tooltip: {
        enabled: true,
      },

      colors: ['#FF4560', '#008FFB', '#00E396', '#775DD0', '#FEB019'],
      legend: {
        show: true,
        position: 'bottom',
      },
    };
  }

  prepareYearWiseData(): void {
    this.yearWiseData = this.evData.reduce(
      (acc: { [key: string]: number }, curr: any) => {
        const year =
          curr['Model Year'] && curr['Model Year'].trim()
            ? curr['Model Year'].trim()
            : 'Unknown';
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      },
      {}
    );
    this.initializeYearChartOptions();
  }

  initializeYearChartOptions(): void {
    const categories = Object.keys(this.yearWiseData);
    const data = Object.values(this.yearWiseData) as number[];

    this.yearChartOptions = {
      series: [{ name: 'EV Count', data }],
      chart: { type: 'line', height: 350 },
      title: { text: 'Year-wise EV Registrations' },
      xaxis: { categories },
      dataLabels: { enabled: true },
    };
  }

  clearFilters(): void {
    this.selectedFilters = [];
  }

  filteredData(): any[] {
    let filtered = this.items;

    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(
        (ev) =>
          ev.Make?.toLowerCase().includes(searchLower) ||
          ev.Model?.toLowerCase().includes(searchLower)
      );
    }

    if (this.selectedFilters.length) {
      const selectedValues = this.selectedFilters.map((filter) => filter.id);
      filtered = filtered.filter(
        (ev) =>
          selectedValues.includes(ev['Model Year']) ||
          selectedValues.includes(ev.State) ||
          selectedValues.includes(ev['Electric Vehicle Type'])
      );
    }

    return filtered;
  }
}
