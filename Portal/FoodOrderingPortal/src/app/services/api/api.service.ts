import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/objects/category';

@Injectable({
  providedIn: 'root'
})


export class APIService {
  API_URL = 'http://localhost/FoodOrderingSystem/API/';
  constructor(private httpClient: HttpClient) { }

  /************ CATEGORIES ***********/
  getCategories () {
    return this.httpClient.post(this.API_URL + "categories/read.php", {});
  }

  getCategoryByID(data: any) {
    return this.httpClient.post(this.API_URL + "categories/read_one.php", data);
  }

  updateCategory(data: any) {
    return this.httpClient.post(this.API_URL + "categories/update.php", data);
  }

  deleteCategory(data: any) {
    return this.httpClient.post(this.API_URL + "categories/delete.php", data);
  }

  addCategory(data: any) {
    return this.httpClient.post(this.API_URL + "categories/create.php", data);
  }


  /************ ITEMS ***********/
  getItems () {
    return this.httpClient.post(this.API_URL + "items/read.php", {});
  }

  getItemByID(data: any) {
    return this.httpClient.post(this.API_URL + "items/read_one.php", data);
  }

  updateItem(data: any) {
    return this.httpClient.post(this.API_URL + "items/update.php", data);
  }

  deleteItem(data: any) {
    return this.httpClient.post(this.API_URL + "items/delete.php", data);
  }

  addItem(data: any) {
    return this.httpClient.post(this.API_URL + "items/create.php", data);
  }


  /************ EMPLOYEES ***********/
  getEmployees () {
    return this.httpClient.post(this.API_URL + "employees/read.php", {});
  }

  getEmployeeByID(data: any) {
    return this.httpClient.post(this.API_URL + "employees/read_one.php", data);
  }

  updateEmployee(data: any) {
    return this.httpClient.post(this.API_URL + "employees/update.php", data);
  }

  deleteEmployee(data: any) {
    return this.httpClient.post(this.API_URL + "employees/delete.php", data);
  }

  addEmployee(data: any) {
    return this.httpClient.post(this.API_URL + "employees/create.php", data);
  }

  /************ ROLES ***********/
  getRoles() {
    return this.httpClient.post(this.API_URL + "roles/read.php", {});
  }

  /************ LOGIN ***********/

  login(data:any) {
    return this.httpClient.post(this.API_URL + "core/core.php", data);
  }
}