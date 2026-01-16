// Invoice model/types
export class Invoice {
  constructor(data) {
    this.id = data.id;
    this.organizationName = data.organizationName;
    this.organizationType = data.organizationType; // 'business' or 'government'
    this.invoiceDate = data.invoiceDate || new Date().toISOString();
    this.dueDate = data.dueDate;
    this.items = data.items || []; // Array of {description, quantity, unitPrice}
    this.taxPercentage = data.taxPercentage || 18; // Default GST/TAX percentage
    this.discountPercentage = data.discountPercentage || 0;
    this.notes = data.notes || '';
    this.status = data.status || 'pending'; // pending, paid, overdue
  }

  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  calculateDiscount() {
    const subtotal = this.calculateSubtotal();
    return (subtotal * this.discountPercentage) / 100;
  }

  calculateTax() {
    const afterDiscount = this.calculateSubtotal() - this.calculateDiscount();
    return (afterDiscount * this.taxPercentage) / 100;
  }

  calculateTotal() {
    return this.calculateSubtotal() - this.calculateDiscount() + this.calculateTax();
  }

  getSummary() {
    return {
      subtotal: this.calculateSubtotal(),
      discount: this.calculateDiscount(),
      discountPercentage: this.discountPercentage,
      tax: this.calculateTax(),
      taxPercentage: this.taxPercentage,
      total: this.calculateTotal(),
    };
  }
}
