import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsUrl = 'http://localhost:3000/transactions';
  private incomesSumUrl = 'http://localhost:3000/sum-incomes';
  private sumUrl = 'http://localhost:3000/sum';
  private sumPastUrl = 'http://localhost:3000/sum-past';
  private sumFutureUrl = 'http://localhost:3000/sum-future';
  private incomesUrl = 'http://localhost:3000/revenus';
  private pastIncomesUrl = 'http://localhost:3000/sum-past-incomes';
  private futureIncomesUrl = 'http://localhost:3000/sum-future-incomes';
  private savingsUrl = 'http://localhost:3000/epargne';
  private savingsIncomesUrl = 'http://localhost:3000/epargne-revenus';
  private savingsExpensesUrl = 'http://localhost:3000/epargne-depenses';
  constructor(private http: HttpClient) { }

  // Pour les revenus

  getIncomes(): Observable<any> {
    return this.http.get(this.incomesUrl);
  }

  getIncomesSum(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(this.incomesSumUrl);
  }

  getIncomesSumPast(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(this.pastIncomesUrl)
  };

  getIncomesSumFuture(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(this.futureIncomesUrl)
  };

  // Méthode pour créer une transaction
  addIncome(income: any): Observable<any> {
    return this.http.post(this.incomesUrl, income);
  }

  updateIncome(income: any): Observable<any> {
    return this.http.put<any>(`${this.incomesUrl}/${income.id}`, income);
  }

  deleteIncome(id: number): Observable<any> {
    return this.http.delete<any>(`${this.incomesUrl}/${id}`);
  }


  // Pour les dépenses

  getTransactions(): Observable<any> {
    return this.http.get(this.transactionsUrl);
  }

  // Méthode pour créer une transaction
  addTransaction(transaction: any): Observable<any> {
    return this.http.post(this.transactionsUrl, transaction, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  updateTransaction(transaction: any): Observable<any> {
    return this.http.put<any>(`${this.transactionsUrl}/${transaction.id}`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.transactionsUrl}/${id}`);
  }

  getSum(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(this.sumUrl);
  }

  getSumPast(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(this.sumPastUrl)
  };

  getSumFuture(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(this.sumFutureUrl)
  };
  // Pour l'épargne

  getSavings(): Observable<any> {
    return this.http.get(this.savingsUrl);
  }

  // Méthode pour créer une épargne
  addSavings(savings: number): Observable<any> {
    return this.http.post(this.savingsUrl, savings);
  }

  updateSavings(savings: number): Observable<any> {
    console.log(`Epargne mise à jour : ${savings}`);
    return this.http.put(`${this.savingsUrl}/1`, { amount: savings })
  }

  deleteSavings(id: any): Observable<any> {
    return this.http.delete(`${this.savingsUrl} / ${id}`);
  }

  // Pour les dépenses dans l'épargne

  getSavingsExpenses(): Observable<any> {
    return this.http.get(this.savingsExpensesUrl);
  }

  // Méthode pour créer une transaction
  addSavingsExpense(savingsExpense: number, savingsCategory: string): Observable<any> {
    return this.http.post(this.savingsExpensesUrl, { amount: savingsExpense, category: savingsCategory });
  }

  updateSavingsExpense(savingsExpense: any): Observable<any> {
    return this.http.put<any>(`${this.savingsExpensesUrl} / ${savingsExpense.id}`, savingsExpense);
  }

  deleteSavingsExpense(id: number): Observable<any> {
    return this.http.delete<any>(`${this.savingsExpensesUrl} / ${id}`);
  }


  // Pour les revenus dans l'épargne

  getSavingsIncomes(): Observable<any> {
    return this.http.get(this.savingsIncomesUrl);
  }

  // Méthode pour créer une transaction
  addSavingsIncome(savingsIncome: number, savingsCategory: string): Observable<any> {
    return this.http.post(this.savingsIncomesUrl, { amount: savingsIncome, category: savingsCategory });
  }

  updateSavingsIncome(savingsIncome: any): Observable<any> {
    return this.http.put<any>(`${this.savingsIncomesUrl} / ${savingsIncome.id}`, savingsIncome);
  }

  deleteSavingsIncome(id: number): Observable<any> {
    return this.http.delete<any>(`${this.savingsIncomesUrl} / ${id}`);
  }
}
