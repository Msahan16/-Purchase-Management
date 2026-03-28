import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Item, Location, PurchaseBill } from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = 'http://localhost:5154/api/purchase-bill';
  private offlineStorageKey = 'offline_purchase_bills';
  private syncStatusSubject = new BehaviorSubject<string>('Online');
  syncStatus$ = this.syncStatusSubject.asObservable();

  constructor(private http: HttpClient) {
    window.addEventListener('online', () => this.onOnline());
    window.addEventListener('offline', () => this.onOffline());
    this.updateStatus();
  }

  private onOnline() {
    this.updateStatus();
    this.syncOfflineBills();
  }

  private onOffline() {
    this.updateStatus();
  }

  private updateStatus() {
    this.syncStatusSubject.next(navigator.onLine ? 'Online' : 'Offline');
  }

  getAll(): Observable<PurchaseBill[]> {
    return this.http.get<PurchaseBill[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Error fetching bills, loading from offline cache');
        return of(this.getOfflineBills());
      })
    );
  }

  getById(id: number): Observable<PurchaseBill> {
    return this.http.get<PurchaseBill>(`${this.apiUrl}/${id}`).pipe(
      catchError(err => {
        const bills = this.getOfflineBills();
        const bill = bills.find(b => b.id === id);
        return bill ? of(bill) : of({} as PurchaseBill);
      })
    );
  }

  save(bill: PurchaseBill): Observable<any> {
    if (!navigator.onLine) {
      this.saveOffline(bill);
      return of({ message: 'Saved offline. Will sync when online.', isOffline: true });
    }

    return this.http.post(this.apiUrl, bill).pipe(
      tap(() => console.log('Bill synced successfully')),
      catchError(err => {
        this.saveOffline(bill);
        return of({ message: 'Sync failed. Saved offline.', isOffline: true });
      })
    );
  }

  update(id: number, bill: PurchaseBill): Observable<any> {
    if (!navigator.onLine) {
      // In offline mode, update in local storage
      const bills = this.getOfflineBills();
      const index = bills.findIndex(b => b.id === id);
      if (index !== -1) {
        bills[index] = bill;
        localStorage.setItem(this.offlineStorageKey, JSON.stringify(bills));
      }
      return of({ message: 'Updated offline.' });
    }
    return this.http.put(`${this.apiUrl}/${id}`, bill);
  }

  private saveOffline(bill: PurchaseBill) {
    const bills = this.getOfflineBills();
    // Simple duplicate check by TransactionNo
    if (!bills.find(b => b.transactionNo === bill.transactionNo)) {
      bills.push({ ...bill, isOffline: true });
      localStorage.setItem(this.offlineStorageKey, JSON.stringify(bills));
    }
  }

  private getOfflineBills(): PurchaseBill[] {
    const data = localStorage.getItem(this.offlineStorageKey);
    return data ? JSON.parse(data) : [];
  }

  private syncOfflineBills() {
    const bills = this.getOfflineBills();
    if (bills.length === 0) return;

    console.log(`Syncing ${bills.length} offline bills...`);
    bills.forEach(bill => {
      this.http.post(this.apiUrl, bill).subscribe({
        next: () => {
          this.removeOfflineBill(bill.transactionNo);
          console.log(`Synced ${bill.transactionNo}`);
        },
        error: (err) => console.error(`Failed to sync ${bill.transactionNo}`, err)
      });
    });
  }

  private removeOfflineBill(transactionNo: string) {
    const bills = this.getOfflineBills().filter(b => b.transactionNo !== transactionNo);
    localStorage.setItem(this.offlineStorageKey, JSON.stringify(bills));
  }
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private apiUrl = 'http://localhost:5154/api';

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}/items`);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/locations`);
  }
}
