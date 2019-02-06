import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { APIService } from '../../services/api/api.service';
import { Items } from '../../objects/items';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';
import { Employees } from 'src/app/objects/employee';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})


export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['UserName', 'FirstName', 'RoleName',  'ContactNumber'];
  dataSource: MatTableDataSource<Items>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private apiService: APIService, private router: Router) {
    this.app.showBackBtn = true;
  }
  
  ngOnInit() {
    this.getEmployees();
  }

  ngOnDestroy() {
    this.app.showBackBtn = false;
  }

  new() {
    this.router.navigate(['employee-detail', 0]);
  }

  getEmployees() {
    this.apiService.getEmployees().subscribe((data) => {
      const employees = JSON.parse(data['Message']);
      this.dataSource = new MatTableDataSource(employees);

      console.log(employees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, (error) => {
      console.log(error);
      this.messageDialog.displayMessageDialog(error);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEmployee(employee: Employees): void {
    this.router.navigate(['employee-detail', employee.EmployeeID]);
  };
}
