import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Injectable } from '@angular/core';

@Component({
  selector: 'app-generic-dialog',
  templateUrl: './generic-dialog.component.html',
  styleUrls: ['./generic-dialog.component.scss']
})
 
@Injectable({
  providedIn: 'root',
})
export class GenericDialogComponent {

  title: string;
  message: string;

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<GenericDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  public displayMessageDialog(message: string) {
    this.title = "Application message";
    this.message = message;

    this.dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '300px',
      data: { title: this.title, message: this.message }
    });
    return this.dialogRef;
  }

}

export interface DialogData {
  title: string;
  message: string;
}