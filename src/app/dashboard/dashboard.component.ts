import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
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
      this.calcAvailableAmount();
      this.getSavings();
    });
  }

  calcAvailableAmount() {
    this.transactionService.getIncomesSum().subscribe((sum) => { this.incomes_amount = sum.totalAmount });
    this.transactionService.getSum().subscribe((sum) => { this.expenses_amount = sum.totalAmount });
    this.available_amount = this.incomes_amount - this.expenses_amount;
    console.log(this.available_amount);
  }

  getSavings() {
    this.transactionService.getSavings().subscribe((data: any) => {
      this.savings = data[0].amount;
    })
  }
}
