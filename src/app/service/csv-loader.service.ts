import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class CsvLoaderService {
  constructor(private http: HttpClient) {}

  private dataUrl = '../../assets/Electric_Vehicle_Population_Data.csv'; // Asset file ka path

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }

  // Method to load and parse the CSV file
  public loadCsvData(csvUrl: string): Observable<any[]> {
    return this.http.get(csvUrl, { responseType: 'text' }).pipe(
      map((data) => {
        const parsedData = Papa.parse(data, { header: true });
        return parsedData.data; // Return the parsed JSON data
      })
    );
  }
}
