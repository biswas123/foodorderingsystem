import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { APIService } from '../../services/api/api.service';
import { Items } from '../../objects/items';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})


export class ItemsComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Description', 'Price', 'CategoryName', 'Available', 'Action'];
  dataSource: MatTableDataSource<Items>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private confirmDialog: ConfirmDialogComponent, private apiService: APIService, private router: Router) {
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

  private getItems() {
    this.apiService.getItems().subscribe((data) => {
      const items = JSON.parse(data.Message);
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

  delete(itemId: any) {
    var params = {
      "itemId": itemId
    };
    this.confirmDialog.displayConfirmMessageDialog('Are you sure you want to delete this item?').afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteItem(params)
          .subscribe(data => {
            this.getItems();
          }, (error) => {
            console.log(error);
            this.messageDialog.displayMessageDialog(error);
          });
      }
    });

  }
}
