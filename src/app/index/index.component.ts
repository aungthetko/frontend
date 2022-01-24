import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeService } from './../service/employee.service';
import { Employee } from './../model/employee';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  public employees!: Employee[];
  public lastEmployees!: Employee[];
  public editEmployee: Employee | null | undefined;
  public deleteEmployee: Employee | undefined | null;

  constructor(private employeeService: EmployeeService ) { }
 
  ngOnInit(){
    this.getEmployees();
    this.getLastEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public getLastEmployees(): void {
    this.employeeService.getlastEmployees().subscribe(
      (response: Employee[]) => {
        this.lastEmployees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public deleteAllEmployee(): void {
    const length: any  = this.employees?.length;
    if(length > 0){
      this.employeeService.deleteAllEmployees().subscribe(
        (undefined)
      );
      window.location.reload();
    }else{
      return;
    }
    window.location.reload();
  }

  public getGenerateEmployee(): void{
    this.employeeService.getGenerateEmployee().subscribe(
      (response: Employee[]) => {
        this.employees = response;
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    this.getEmployees();
    window.location.reload();
  }

  public onAddEmployee(addForm: NgForm): void{
      this.employeeService.addEmployee(addForm.value).subscribe(
        (response: Employee) => {
          console.log(response);
          this.getEmployees();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
      window.location.reload();
      document.getElementById('add-employee-form')?.click();
  }

  public onUpdateEmployee(employee: Employee): void{
    this.employeeService.updateEmployee(employee).subscribe(
      (response: Employee) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    document.getElementById('update-employee-form')?.click();
  }

  public onDeleteEmployee(employeeId: number | undefined): void{
    this.employeeService.delete(employeeId).subscribe(
      (response: void) => {
        console.log(response);
        this.getEmployees();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
    window.location.reload();
    document.getElementById('delete-employee-form')?.click();
  }


  public onSearchEmployees(key: string){
    console.log(key);
    const results: Employee[] = new Array;
    for(const employee of this.employees){
      if(employee.firstName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.lastName.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.email.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1
      || employee.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1){
        results.push(employee); 
      }
    }
    this.employees = results;
    if(results.length === 0 || !key){
      this.getEmployees();
    }
  }

  public onOpenModal(employee: Employee | null, mode: string): void{
      const container = document.getElementById('main-container');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-bs-toggle', 'modal');
      if(mode === 'add'){
        button.setAttribute('data-bs-target', '#addEmployeeModal');
      }
      if(mode === 'edit'){
        this.editEmployee = employee;
        button.setAttribute('data-bs-target', '#updateEmployeeModal');
      }
      if(mode === 'delete'){
        this.deleteEmployee = employee;
        button.setAttribute('data-bs-target', '#deleteEmployeeModal');
      }
      container?.appendChild(button);
      button.click();
  }

}
