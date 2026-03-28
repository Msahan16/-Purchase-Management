import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PurchaseService, MasterDataService } from '../../services/purchase.service';
import { Item, Location, PurchaseBill, PurchaseItem } from '../../models/purchase.model';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './purchase-form.component.html'
})
export class PurchaseFormComponent implements OnInit {
  purchaseForm!: FormGroup;
  items: Item[] = [];
  locations: Location[] = [];
  isEdit = false;
  billId: number | null = null;
  syncStatus = 'Online';

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private masterDataService: MasterDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  createForm() {
    this.purchaseForm = this.fb.group({
      transactionNo: ['PUR-' + Math.floor(Math.random() * 100000), [Validators.required]],
      transactionDate: [new Date().toISOString().split('T')[0], [Validators.required]],
      items: this.fb.array([]),
      totalItems: [{ value: 0, disabled: true }],
      totalQuantity: [{ value: 0, disabled: true }],
      totalAmount: [{ value: 0, disabled: true }]
    });
  }

  get itemsFormArray() {
    return this.purchaseForm.get('items') as FormArray;
  }

  ngOnInit() {
    this.purchaseService.syncStatus$.subscribe(s => this.syncStatus = s);

    // Load master data FIRST, then load bill if editing
    forkJoin({
      items: this.masterDataService.getItems(),
      locations: this.masterDataService.getLocations()
    }).subscribe({
      next: (result) => {
        this.items = result.items;
        this.locations = result.locations;
        console.log('Items loaded:', this.items);
        console.log('Locations loaded:', this.locations);
        this.initRoute();
      },
      error: (err) => {
        console.error('Error loading master data:', err);
        this.initRoute();
      }
    });

    // Watch for changes in the form array to recalculate totals
    this.itemsFormArray.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  private initRoute() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.billId = +params['id'];
        this.loadBill(this.billId);
      } else {
        this.addItem();
      }
    });
  }

  loadBill(id: number) {
    this.purchaseService.getById(id).subscribe(bill => {
      this.purchaseForm.patchValue({
        transactionNo: bill.transactionNo,
        transactionDate: new Date(bill.transactionDate).toISOString().split('T')[0]
      });

      this.itemsFormArray.clear();
      if (bill.items && bill.items.length > 0) {
        bill.items.forEach(item => {
          this.addItem(item);
        });
      }
      this.calculateTotals();
    });
  }

  addItem(item?: PurchaseItem) {
    const itemGroup = this.fb.group({
      id: [item?.id || 0],
      itemId: [item?.itemId || '', Validators.required],
      itemName: [item?.itemName || this.getItemName(item?.itemId) || ''],
      locationId: [item?.locationId || '', Validators.required],
      cost: [item?.cost || 0, [Validators.required, Validators.min(0)]],
      price: [item?.price || 0, [Validators.required, Validators.min(0)]],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      discountPercent: [item?.discountPercent || 0, [Validators.min(0), Validators.max(100)]],
      totalCost: [{ value: 0, disabled: true }],
      totalSelling: [{ value: 0, disabled: true }]
    });

    // Calculate initial values immediately
    this.recalculateRow(itemGroup);

    // Row level recalculation on every change
    itemGroup.valueChanges.subscribe(() => {
      this.recalculateRow(itemGroup);
    });

    this.itemsFormArray.push(itemGroup);
  }

  recalculateRow(itemGroup: FormGroup) {
    const cost = Number(itemGroup.get('cost')?.value) || 0;
    const price = Number(itemGroup.get('price')?.value) || 0;
    const qty = Number(itemGroup.get('quantity')?.value) || 0;
    const disc = Number(itemGroup.get('discountPercent')?.value) || 0;

    const totalCostRaw = cost * qty;
    const totalCost = totalCostRaw - (totalCostRaw * (disc / 100));
    const totalSelling = price * qty;

    itemGroup.patchValue({ totalCost, totalSelling }, { emitEvent: false });
  }

  getItemName(id: number | undefined): string {
    if (!id) return '';
    const item = this.items.find(i => i.id === id);
    return item ? item.name : '';
  }

  onItemChange(index: number) {
    const group = this.itemsFormArray.at(index) as FormGroup;
    const name = group.get('itemName')?.value;
    const item = this.items.find(i => i.name === name);
    if (item) {
      group.patchValue({ itemId: item.id });
    } else {
      group.patchValue({ itemId: '' });
    }
  }

  removeItem(index: number) {
    this.itemsFormArray.removeAt(index);
    this.calculateTotals();
  }

  calculateTotals() {
    const items = this.itemsFormArray.getRawValue();
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum: number, i: any) => sum + (Number(i.quantity) || 0), 0);
    // Use totalCost (cost-based with discount applied), NOT totalSelling
    const totalAmount = items.reduce((sum: number, i: any) => sum + (Number(i.totalCost) || 0), 0);

    this.purchaseForm.patchValue({
      totalItems,
      totalQuantity,
      totalAmount
    }, { emitEvent: false });
  }

  onSubmit() {
    if (this.purchaseForm.invalid) {
      alert('Please fill all mandatory fields correctly.');
      return;
    }

    const rawData = this.purchaseForm.getRawValue();
    const bill: PurchaseBill = {
      id: this.billId || 0,
      transactionNo: rawData.transactionNo,
      transactionDate: rawData.transactionDate,
      totalItems: rawData.totalItems,
      totalQuantity: rawData.totalQuantity,
      totalAmount: rawData.totalAmount,
      items: rawData.items.map((item: any) => ({
        id: item.id || 0,
        itemId: Number(item.itemId),
        locationId: item.locationId,
        cost: Number(item.cost),
        price: Number(item.price),
        quantity: Number(item.quantity),
        discountPercent: Number(item.discountPercent),
        totalCost: Number(item.totalCost),
        totalSelling: Number(item.totalSelling)
      }))
    };

    if (this.isEdit) {
      this.purchaseService.update(this.billId!, bill).subscribe({
        next: (res: any) => {
          alert(res?.message || 'Updated successfully!');
          this.router.navigate(['/purchase-list']);
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Failed to update bill.');
        }
      });
    } else {
      this.purchaseService.save(bill).subscribe({
        next: (res: any) => {
          alert(res?.message || 'Saved successfully!');
          this.router.navigate(['/purchase-list']);
        },
        error: (err) => {
          console.error('Save error:', err);
          alert('Failed to save bill.');
        }
      });
    }
  }

  printForm() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/purchase-list']);
  }

  downloadPDF() {
    const doc = new jsPDF();
    const data = this.purchaseForm.getRawValue();
    const transNo = data.transactionNo || 'N/A';
    const date = data.transactionDate || new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.text('PURCHASE BILL', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Transaction No: ${transNo}`, 14, 35);
    doc.text(`Date: ${date}`, 14, 40);

    const tableData = this.itemsFormArray.controls.map((group, index) => {
      const val = group.getRawValue();
      const itemName = this.getItemName(val.itemId);
      const loc = this.locations.find(l => l.id === val.locationId)?.name || '';
      return [
        index + 1,
        itemName,
        loc,
        Number(val.cost).toFixed(2),
        Number(val.price).toFixed(2),
        val.quantity,
        val.discountPercent + '%',
        Number(val.totalCost).toFixed(2)
      ];
    });

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Item', 'Batch', 'Cost', 'Price', 'Qty', 'Disc%', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 9 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Amount: ${Number(data.totalAmount).toFixed(2)}`, 140, finalY);

    doc.save(`Bill_${transNo}.pdf`);
  }
}
