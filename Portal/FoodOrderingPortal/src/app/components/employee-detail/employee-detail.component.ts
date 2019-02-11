import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ResolveStart } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api/api.service';
import { GenericDialogComponent } from '../../dialogs/generic-dialog/generic-dialog.component'
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';

import { AppComponent } from 'src/app/app.component';
import { Roles } from 'src/app/objects/roles';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss']
})
export class EmployeeDetailComponent implements OnInit {

  page: String;
  id: any;
  editForm: FormGroup;
  roles: Roles;

  constructor(private app: AppComponent, private messageDialog: GenericDialogComponent, private confirmDialog: ConfirmDialogComponent, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, private apiService: APIService) {
    this.app.showBackBtn = true;
  }
  ngOnInit() {
    this.page = "Employee Details";
    this.id = this.route.snapshot.paramMap.get('id');
    this.getRoles();

    this.editForm = this.formBuilder.group({
      EmployeeID: [''],
      UserName: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      ContactNumber: ['', Validators.required],
      Address: ['', Validators.required],
      RoleID: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]]
    });


    if (this.id != 0) {
      var params = { "employeeId": this.id };
      this.apiService.getEmployeeByID(params)
        .subscribe(data => {
          console.log(data);
          var details = JSON.parse(data.Message)[0];
          this.editForm.patchValue(details);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    }
  }

  getRoles() {
    this.apiService.getRoles().subscribe((data) => {
      this.roles = JSON.parse(data.Message);
    }, (error) => {
      console.log(error);
      this.messageDialog.displayMessageDialog(error);
    });
  }

  save() {
    console.warn(this.editForm.value);
    let param = {
      "username": this.editForm.controls.UserName.value,
      "firstname": this.editForm.controls.FirstName.value,
      "lastname": this.editForm.controls.LastName.value,
      "contactnumber": this.editForm.controls.ContactNumber.value,
      "address": this.editForm.controls.Address.value,
      "roleId": this.editForm.controls.RoleID.value,
      "email": this.editForm.controls.Email.value
    };

    if (this.id != 0) {
      param["employeeId"] = this.editForm.controls.EmployeeID.value;
      this.apiService.updateEmployee(param)
        .subscribe(data => {
          this.router.navigate(['employees']);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    } else {
      this.apiService.addEmployee(param)
        .subscribe(data => {
          this.router.navigate(['employees']);
        }, (error) => {
          console.log(error);
          this.messageDialog.displayMessageDialog(error);
        });
    }
  }

  delete() {
    var params = {
      "employeeId": this.editForm.controls.EmployeeID.value
    };
    this.confirmDialog.displayConfirmMessageDialog('Are you sure you want to delete this item?').afterClosed().subscribe(result => {
      if (result) {
        this.apiService.deleteEmployee(params)
          .subscribe(data => {
            this.router.navigate(['employees']);
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

