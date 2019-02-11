import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api/api.service';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/objects/category';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {

  page: String;
  id: any;
  editForm: FormGroup;
  categories: Array<Category>;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private confirmDialog: ConfirmDialogComponent, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private apiService: APIService) {
    this.app.showBackBtn = true;
  }
  ngOnInit() {
    this.page = "Food Item";
    this.id = this.route.snapshot.paramMap.get('id');
    this.editForm = this.formBuilder.group({
      ItemID: [''],
      Name: ['', Validators.required],
      Description: [''],
      Available: [true],
      Price: ['', Validators.required],
      CategoryID: ['', Validators.required]
    });


    if (this.id != 0) {
      var params = { "itemId": this.id };
      this.apiService.getItemByID(params)
        .subscribe(data => {
          var details = JSON.parse(data.Message)[0];
          this.editForm.patchValue(details);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    }
    this.getCategories();
  }

  getCategories() {
    this.apiService.getCategories().subscribe((data) => {
      this.categories = JSON.parse(data.Message);
    }, (error) => {
      console.log(error);
      this.messageDialog.displayMessageDialog(error);
    });
  }

  save() {
    console.warn(this.editForm.value);
    let param = {
      "name": this.editForm.controls.Name.value,
      "description": this.editForm.controls.Description.value,
      "available": this.editForm.controls.Available.value ? 1 : 0,
      "price": this.editForm.controls.Price.value,
      "categoryId": this.editForm.controls.CategoryID.value
    };
    if (this.id != 0) {
      param["itemId"] = this.editForm.controls.ItemID.value;
      this.apiService.updateItem(param)
        .subscribe(data => {
          this.router.navigate(['items']);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    } else {
      this.apiService.addItem(param)
        .subscribe(data => {
          this.router.navigate(['items']);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    }
  }

  delete() {
    var params = {
      "itemId": this.editForm.controls.ItemID.value
    };
    this.confirmDialog.displayConfirmMessageDialog('Are you sure you want to delete this item?').afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteItem(params)
          .subscribe(data => {
            this.router.navigate(['items']);
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
