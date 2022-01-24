import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from './../model/employee';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // find all employees
  public getEmployees() : Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.apiUrl}/employee/all`);
  }

  // find all employees
  public getlastEmployees() : Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.apiUrl}/employee/last`);
  }

  // add new employee
  public addEmployee(employee: Employee) : Observable<Employee>{
    return this.http.post<Employee>(`${this.apiUrl}/employee/add`, employee);
  }

  // update an employee
  public updateEmployee(employee: Employee) : Observable<Employee>{
    return this.http.put<Employee>(`${this.apiUrl}/employee/update/`, employee);
  }
  
  // delete an employee
  public delete(employeeId: number | undefined) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/employee/delete/${employeeId}`);
  }

  // get generate employee
  public getGenerateEmployee() : Observable<Employee[]>{
    return this.http.get<Employee[]>(`${this.apiUrl}/employee/generate`);
  }

  public deleteAllEmployees(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/employee/delete/all`)
  }
}
