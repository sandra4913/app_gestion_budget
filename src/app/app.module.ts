import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { IncomesComponent } from './incomes/incomes.component';
import { MenuComponent } from './menu/menu.component';
import { ProjectsComponent } from './projects/projects.component';
import { SavingsComponent } from './savings/savings.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ExpensesComponent,
    IncomesComponent,
    MenuComponent,
    ProjectsComponent,
    SavingsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
