import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomesComponent } from './incomes/incomes.component';
import { ProjectsComponent } from './projects/projects.component';
import { SavingsComponent } from './savings/savings.component';

const routes: Routes = [{ path: '', component: DashboardComponent },
{ path: 'depenses', component: ExpensesComponent },
{ path: 'revenus', component: IncomesComponent },
{ path: 'projets', component: ProjectsComponent },
{ path: 'epargne', component: SavingsComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
