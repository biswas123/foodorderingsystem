import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { APIService } from '../../services/api/api.service';
import { Category } from '../../objects/category';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { Router } from "@angular/router";
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})


export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['Name', 'Description', 'Available'];
  dataSource: MatTableDataSource<Category>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private apiService: APIService, private router: Router) {
    this.app.showBackBtn = true;
  }

  ngOnInit() {
    this.getCategories();
  }
  ngOnDestroy() {
    this.app.showBackBtn = false;
  }

  new() {
    this.router.navigate(['category-detail', 0]);
  }

  getCategories() {
    this.apiService.getCategories().subscribe((data) => {
      const categories = JSON.parse(data['Message']);
      this.dataSource = new MatTableDataSource(categories);

      console.log(categories);
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

  editCategory(category: Category): void {
    this.router.navigate(['category-detail', category.CategoryID]);
  };
}
