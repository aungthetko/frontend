import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
  ChartItem
} from 'chart.js';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle
);
import { Subject } from 'rxjs';
import { SystemCPU } from '../interface/system-cpu';
import { SystemHealth } from '../interface/system-health';
import { DashboardService } from '../service/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public traceList: any[] = [];
  public selectedTrace: any;
  public systemHealth: SystemHealth;
  public SystemCPU: SystemCPU;
  public processUpTime: string;
  public http200Traces: any[] = [];
  public http404Traces: any[] = [];
  public http500Traces: any[] = [];
  public http400Traces: any[] = [];
  public httpDefaultTraces: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  constructor(private router: Router, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getTraces();
    this.getCpuUsage();
    // this.getSystemHealth();
  }

  private getTraces(): void{
    this.dashboardService.getHttpTraces().subscribe(
      (response: any) => {
        this.processTraces(response.traces);
        this.initializeBarChart();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  private getCpuUsage(): void{
    this.dashboardService.getSystemCPU().subscribe(
      (response: SystemCPU) => {
        this.SystemCPU = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
  
  // TO-DO


  // private getSystemHealth(): void{
  //   this.dashboardService.getSystemHealth().subscribe(
  //     (response: SystemHealth) => {
  //       console.log(response);
  //       this.systemHealth = response;
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   )
  // }
  
  processTraces(traces: any): void {
    this.traceList = traces;
    this.traceList.forEach(trace => {
      switch(trace.response.status){     
        case 200:
          this.http200Traces.push(trace);
          break;

        case 404:
          this.http404Traces.push(trace);
          break;

        case 400:
          this.http400Traces.push(trace);
          break;

        default:
          this.httpDefaultTraces.push(trace);
          break;
      }
    })
  }

  private initializeBarChart(): Chart {
    const element: any = document.getElementById('barChart');
    return new Chart(element, {
      type: 'bar',
      data: {
          labels: ['200', '404', '400', '500'],
          datasets: [{data: [this.http200Traces.length, this.http404Traces.length, this.http400Traces.length, this.http500Traces.length],
              backgroundColor: ['#03AC13', '#3388FF', 'rgb(253,126,20)', 'rgb(220,53,69)'],
              borderColor: ['#03AC13', '#3388FF', 'rgb(253,126,20)', 'rgb(220,53,69)'],
              borderWidth: 3
          }]
      },
      // options: {
      //   title: { display: true, text: [`Last 100 Requests as of ${this.formatDate(new Date())}`] },
      //   legend: { display: false },
      //   scales: {
      //         yAxes: [{
      //             ticks: {
      //                 beginAtZero: true
      //             }
      //         }]
      //     }
      // }
  });
  }

  private formatDate(date: Date): string {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const year = date.getFullYear();
    if (dd < 10) {
      const day = `0${dd}`;
    }
    if (mm < 10) {
      const month = `0${mm}`;
    }
    return `${mm}/${dd}/${year}`;
  }

  public onSelectTrace(trace: any): void {
    console.log(trace);
    this.selectedTrace = trace;
    document.getElementById('trace-modal')?.click();
  }

  logOut(): void {
    this.dashboardService.logOut();
    this.router.navigateByUrl('/login');
  }

}
