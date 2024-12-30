import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title: string = 'Tableau de bord';
  incomes_amount: number = 0;
  expenses_amount: number = 0;
  available_amount: number = 0;
  savings: number = 0;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.getSavings();
      this.calcAvailableAmount();
    });
  }

  calcAvailableAmount() {
    // Utilisation de forkJoin pour combiner les deux observables
    forkJoin({
      incomes: this.transactionService.getIncomesSum(),
      expenses: this.transactionService.getSum()
    }).subscribe(({ incomes, expenses }) => {
      this.incomes_amount = incomes.totalAmount;
      this.expenses_amount = expenses.totalAmount;
      this.available_amount = this.incomes_amount - this.expenses_amount;
    });
  }

  getSavings() {
    this.transactionService.getSavings().subscribe((data: any) => {
      this.savings = data[0].amount;
    });
  }
}
