import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.css'
})
export class IncomesComponent implements OnInit {
  title: string = 'Revenus';
  incomes: any[] = [];
  lastIncomes: any[] = [];
  pastIncomes: any[] = [];
  futureIncomes: any[] = [];
  totalIncomes: number = 0;
  totalPastIncomes: number = 0;
  totalFutureIncomes: number = 0;
  income: number = 0;
  inputValue: number = 0;
  inputCategory: string = '';
  index: number = -1;

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.route.params.subscribe(() => {
      this.transactionService.getIncomes().subscribe((data) => {
        this.loadSumFutureIncomes();
        this.loadSumPastIncomes();
        this.incomes = data;
        if (this.isFirstDayOfMonth()) {
          this.resetIncomes();
        }
        this.categorizeIncomes();
      })
      this.transactionService.getIncomesSum().subscribe((sum) => {
        if (sum && sum.totalAmount !== undefined) {
          this.totalIncomes = sum.totalAmount;
        } else {
          console.error('totalAmount est manquant dans la réponse:', sum);
        }
      });
    });
  }

  private loadSumPastIncomes(): void {
    const pastIncome = this.pastIncomes.filter((income) => income.statut === 'effectuée');
    if (pastIncome) {
      this.transactionService.getIncomesSumPast().subscribe((sum) => { this.totalPastIncomes = sum.totalAmount })
    }
  }

  private loadSumFutureIncomes(): void {
    const futureIncome = this.futureIncomes.filter((income) => income.statut === 'a venir');
    if (futureIncome) {
      this.transactionService.getIncomesSumFuture().subscribe((sum) => { this.totalFutureIncomes = sum.totalAmount })
    }
  }

  addIncome() {
    const newIncome = {
      amount: parseFloat(this.inputValue.toString()),
      category: 'ponctuel',
      statut: 'effectuée',
      date: new Date().getDate(),
      description: this.inputCategory
    };

    this.transactionService.addIncome(newIncome).subscribe((response) => {
      this.categorizeIncomes();
    });
    this.updateTotalRevenus(newIncome.amount);
    this.resetInputs();
  }

  private updateTotalRevenus(amount: number): void {
    this.totalIncomes += amount;
  }

  private resetInputs(): void {
    this.inputValue = 0;
    this.inputCategory = '';
  }

  deleteIncome(income: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce revenu ?')) {
      // Appel au service pour supprimer le revenu
      this.transactionService.deleteIncome(income.id).subscribe(
        () => {
          // Mise à jour de la liste des revenus : suppression locale
          this.incomes = this.incomes.filter((item) => item.id !== income.id);
          // Mise à jour du total des revenus
          this.totalIncomes -= income.amount;
        },
        (error) => {
          console.error('Erreur lors de la suppression du revenu :', error);
        }
      );
    }
  }

  isFirstDayOfMonth(): boolean {
    const today = new Date();
    return today.getDate() === 1;
  }

  resetIncomes(): void {
    const ponctuelIncomes = this.incomes.filter((income) => income.category === 'ponctuel');

    ponctuelIncomes.forEach((income) => {
      this.transactionService.deleteIncome(income.id).subscribe(() => {
        // Mise à jour de la liste locale
        this.incomes = this.incomes.filter((item) => item.id !== income.id);

        // Mise à jour du total des revenus
        this.totalIncomes -= income.amount;

        console.log(`Revenu ponctuel avec ID ${income.id} supprimé.`);
      },
        (error) => {
          console.error('Erreur lors de la suppression du revenu :', error);
        });
    });
  }


  updateIncome(income: any) {
    console.log('bouton de modification cliqué');
  }

  categorizeIncomes() {
    const today = new Date();
    const day = getDayFromDate(today);
    function getDayFromDate(date: Date): number {
      return date.getDate();
    }
    this.pastIncomes = [];
    this.futureIncomes = [];

    this.incomes.forEach(income => {
      if (income.date != null) {
        if (income.date <= day) {
          this.pastIncomes.unshift(income);
          income.statut = 'Effectuée';
          this.transactionService.updateIncome(income);
        } else if (income.date > day) {
          this.futureIncomes.unshift(income);
          income.statut = 'A venir';
          this.transactionService.updateIncome(income);
        }
      }
    })
  }
}

