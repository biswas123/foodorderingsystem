
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Injectable } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})


@Injectable({
  providedIn: 'root',
})

export class ConfirmDialogComponent {

  title: string;
  message: string;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public displayConfirmMessageDialog(message: string) {
    this.title = "Confirm message";
    this.message = message;

    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { title: this.title, message: this.message }
    });
    return this.dialogRef;
  }

}

export interface DialogData {
  title: string;
  message: string;
}
