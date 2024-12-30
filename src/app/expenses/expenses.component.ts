import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  title: string = 'Dépenses';
  transactions: any[] = [];
  lastExpenses: any[] = [];
  pastExpenses: any[] = [];
  futureExpenses: any[] = [];
  totalRevenus: number = 0;
  inputValue: number = 0;
  inputCategory: string = '';
  totalPastExpenses: number = 0;
  totalFutureExpenses: number = 0;
  index: number = -1;


  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.loadTransactions();
      this.loadTotalRevenus();
      this.loadSumPastExpenses();
      this.loadSumFutureExpenses();
    });
  }

  private loadTransactions(): void {
    this.transactionService.getTransactions().subscribe((data) => {
      this.transactions = data;
      if (this.isFirstDayOfMonth()) {
        this.resetExpenses();
      }
      this.categorizeExpenses();
    }, (error) => {
      console.error('Erreur lors de la récupération des transactions:', error);
    });
  }

  private loadTotalRevenus(): void {
    this.transactionService.getSum().subscribe((sum) => {
      if (sum && sum.totalAmount !== undefined) {
        this.totalRevenus = sum.totalAmount;
      } else {
        console.error('totalAmount est manquant dans la réponse:', sum);
      }
    }, (error) => {
      console.error('Erreur lors de la récupération de la somme totale:', error);
    });
  }

  private loadSumPastExpenses(): void {
    const pastExpense = this.pastExpenses.filter((expense) => expense.statut === 'effectuée');
    if (pastExpense) {
      this.transactionService.getSumPast().subscribe((sum) => { this.totalPastExpenses = sum.totalAmount })
    }
  }

  private loadSumFutureExpenses(): void {
    const futureExpense = this.pastExpenses.filter((expense) => expense.statut === 'a venir');
    if (futureExpense) {
      this.transactionService.getSumFuture().subscribe((sum) => { this.totalFutureExpenses = sum.totalAmount })
    }
  }

  addExpense(): void {
    if (!this.inputValue || !this.inputCategory) {
      console.error('Les champs montant et catégorie sont requis.');
      return;
    }

    const newTransaction = {
      amount: parseFloat(this.inputValue.toString()),
      category: 'ponctuelle',
      statut: 'effectuée',
      date: new Date().getDate(),
      description: this.inputCategory
    };

    this.transactionService.addTransaction(newTransaction).subscribe((response: any) => {
      this.categorizeExpenses();
    }, (error) => {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
    });

    this.updateTotalRevenus(newTransaction.amount);
    this.resetInputs();
  }

  private updateTotalRevenus(amount: number): void {
    this.totalRevenus += amount;
  }

  private resetInputs(): void {
    this.inputValue = 0;
    this.inputCategory = '';
  }

  isFirstDayOfMonth(): boolean {
    const today = new Date();
    return today.getDate() === 1;
  }

  resetExpenses(): void {
    const ponctuelExpenses = this.pastExpenses.filter((expense) => expense.category === 'ponctuelle');

    ponctuelExpenses.forEach((expense) => {
      this.transactionService.deleteIncome(expense.id).subscribe(() => {
        // Mise à jour de la liste locale
        this.pastExpenses = this.pastExpenses.filter((item) => item.id !== expense.id);

        // Mise à jour du total des revenus
        this.totalRevenus -= expense.amount;

        console.log(`Revenu ponctuel avec ID ${expense.id} supprimé.`);
      },
        (error) => {
          console.error('Erreur lors de la suppression du revenu :', error);
        });
    });
  }

  categorizeExpenses(): void {
    const today = new Date().getDate();

    this.pastExpenses = [];
    this.futureExpenses = [];

    this.transactions.forEach(transaction => {
      if (transaction.date !== null) {
        if (transaction.date <= today) {
          this.pastExpenses.unshift(transaction);
          transaction.statut = 'Effectuée';
        } else {
          this.futureExpenses.push(transaction);
          transaction.statut = 'A venir';
        }
        this.transactionService.updateTransaction(transaction).subscribe();
      }
    });
  }

  deleteExpense(expense: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      // Appel au service pour supprimer le revenu
      this.transactionService.deleteTransaction(expense.id).subscribe(
        () => {
          // Mise à jour de la liste des revenus : suppression locale
          this.pastExpenses = this.pastExpenses.filter((item) => item.id !== expense.id);
          // Mise à jour du total des revenus
          this.totalPastExpenses -= expense.amount;
        },
        (error) => {
          console.error('Erreur lors de la suppression de la dépense :', error);
        }
      );
    }
  }

  updateExpense(expense: any) {
    console.log('bouton de modification cliqué');
    const newAmount = prompt('Saisissez le nouveau montant');
    if (newAmount) {
      const parsedAmount = parseFloat(newAmount);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        const updatedExpense = { id: expense.id, amount: parsedAmount, category: expense.category, statut: expense.statut, date: expense.date, description: expense.description };
        this.transactionService.updateTransaction(updatedExpense).subscribe(() => {
          expense.amount = parsedAmount;
        })
      }
    }
  }

}
