import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { User } from '../model/user';
import { UserService } from '../service/user.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-userlists',
  templateUrl: './userlists.component.html',
  styleUrls: ['./userlists.component.css']
})
export class UserlistsComponent implements OnInit, OnDestroy {

  public users: User[] | undefined | any;
  fileName= 'ExcelSheet.xlsx';
  spinnerEnabled = false;
  keys: string[];
  dataSheet  = new Subject<any>();
  @ViewChild('inputFile') inputFile: ElementRef;
  isExcelFile: boolean;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private userService: UserService) { }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  onChange(evt: any) {
    let data : any, header;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if(target.files.length > 1){
      this.inputFile.nativeElement.value = '';
    }
    if(this.isExcelFile){
      this.spinnerEnabled = true;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws:XLSX.WorkSheet = wb.Sheets[wsname];

        data = XLSX.utils.sheet_to_json(ws);
      };

      reader.readAsBinaryString(target.files[0]);

      reader.onloadend = (e) => {
        this.spinnerEnabled = false;
        this.keys = Object.keys(data[0]);
        this.dataSheet.next(data);
      }
    }else{
      this.inputFile.nativeElement.value = '';
    }
  }

  exportExcel(): void{
    let tableId = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(tableId);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }

  getAllUsers(): void{
    this.userService.getUsers().subscribe(
      (response: User[]) => {
        this.users = response;
        this.dtTrigger.next();
        console.log(this.users)
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }
}
