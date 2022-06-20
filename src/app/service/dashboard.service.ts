import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SystemCPU } from '../interface/system-cpu';
import { SystemHealth } from '../interface/system-health';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getHttpTraces(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/actuator/httptrace`);
  }

  public getSystemHealth(): Observable<SystemHealth>{
    return this.http.get<SystemHealth>(`${this.apiUrl}/actuator/health`);
  }

  public getSystemCPU(): Observable<SystemCPU>{
    return this.http.get<SystemCPU>(`${this.apiUrl}/actuator/metrics/system.cpu.count`);
  }

  public getProcessUpTime(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/actuator/metrics/process.uptime`);
  }

  logOut() : void{
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}
