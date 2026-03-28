import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseBill } from '../../models/purchase.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-list.component.html'
})
export class PurchaseListComponent implements OnInit {
  bills: PurchaseBill[] = [];
  loading = true;

  constructor(private purchaseService: PurchaseService, private router: Router) {}

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    this.loading = true;
    this.purchaseService.getAll().subscribe({
      next: (data) => {
        this.bills = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  editBill(id: number) {
    this.router.navigate(['/purchase-edit', id]);
  }

  createNew() {
    this.router.navigate(['/purchase-add']);
  }
}
