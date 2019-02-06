import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api/api.service';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {

  page: String;
  id: any;
  editForm: FormGroup;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private confirmDialog: ConfirmDialogComponent, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private apiService: APIService) {
    this.app.showBackBtn = true;
  }

  ngOnInit() {
    this.page = "Category";
    this.id = this.route.snapshot.paramMap.get('id');
    this.editForm = this.formBuilder.group({
      CategoryID: [''],
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      Available: [true]
    });


    if (this.id != 0) {
      var params = { "categoryId": this.id };
      this.apiService.getCategoryByID(params)
        .subscribe(data => {
          var details = JSON.parse(data['Message'])[0];
          this.editForm.patchValue(details);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    }
  }

  save() {
    console.warn(this.editForm.value);
    let param = {
      "name": this.editForm.controls.Name.value,
      "description": this.editForm.controls.Description.value,
      "available": this.editForm.controls.Available.value ? 1 : 0
    };
    if (this.id != 0) {
      param["categoryId"] = this.editForm.controls.CategoryID.value;
      this.apiService.updateCategory(param)
        .subscribe(data => {
          this.router.navigate(['category']);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    } else {
      this.apiService.addCategory(param)
        .subscribe(data => {
          this.router.navigate(['category']);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    }
  }

  delete() {
    var params = {
      "categoryId": this.editForm.controls.CategoryID.value
    };
    this.confirmDialog.displayConfirmMessageDialog('Are you sure you want to delete this item?').afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteCategory(params)
          .subscribe(data => {
            this.router.navigate(['category']);
          }, (error) => {
            console.log(error);
            this.messageDialog.displayMessageDialog(error);
          });
      }
    });

  }

  ngOnDestroy() {
    this.app.showBackBtn = false;
  }

}
