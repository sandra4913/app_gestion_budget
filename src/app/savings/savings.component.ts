import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css'
})
export class SavingsComponent implements OnInit {
  title: string = 'Epargne';
  savingsIncome: any[] = [];
  savingsExpense: any[] = [];
  savings: number = 0;
  inputValue: number = 0;
  inputCategory: string = '';

  constructor(
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(() => {
      this.transactionService.getSavingsIncomes().subscribe((data) => {
        this.savingsIncome = data.reverse().slice(0, 10);
      });
      this.transactionService.getSavingsExpenses().subscribe((data) => {
        this.savingsExpense = data.reverse().slice(0, 10);
      });
      this.transactionService.getSavings().subscribe((data: any) => {
        this.savings = data[0].amount;
      });

    })
  }

  addExpense() {
    this.savings -= this.inputValue;
    this.transactionService.addSavingsExpense(this.inputValue, this.inputCategory).subscribe((data: any) => {
      this.savingsExpense.push(data);
      if (this.savingsExpense.length > 10) {
        this.savingsExpense = this.savingsExpense.slice(0, 10)
      }
    });
    this.transactionService.updateSavings(this.savings).subscribe();
    this.inputValue = 0;
    this.inputCategory = '';
  }


  addIncome() {
    this.savings += this.inputValue;
    this.transactionService.addSavingsIncome(this.inputValue, this.inputCategory).subscribe((data: any) => {
      this.savingsIncome.push(data);
      if (this.savingsIncome.length > 10) {
        this.savingsIncome = this.savingsIncome.slice(0, 10);
      }
    });
    this.transactionService.updateSavings(this.savings).subscribe();
    this.inputValue = 0;
    this.inputCategory = '';
  }

}
