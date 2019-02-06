import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { APIService } from '../../services/api/api.service';
import { Items } from '../../objects/items';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})


export class ItemsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Description', 'Price', 'CategoryName', 'Available'];
  dataSource: MatTableDataSource<Items>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private apiService: APIService, private router: Router) {
    this.app.showBackBtn = true;
  }
  
  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    this.app.showBackBtn = false;
  }

  new() {
    this.router.navigate(['item-detail', 0]);
  }

  getItems() {
    this.apiService.getItems().subscribe((data) => {
      const items = JSON.parse(data['Message']);
      this.dataSource = new MatTableDataSource(items);

      console.log(items);
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

  editItem(item: Items): void {
    this.router.navigate(['item-detail', item.ItemID]);
  };
}
