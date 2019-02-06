import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './components/category/category.component';

import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { DashBoardComponent } from './components/dash-board/dash-board.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './providers/auth-guard/auth.guard';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashBoardComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent },
  { path: 'category-detail/:id', component: CategoryDetailComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'item-detail/:id', component: ItemDetailComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employee-detail/:id', component: EmployeeDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
