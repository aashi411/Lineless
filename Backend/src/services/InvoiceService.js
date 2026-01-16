import PDFDocument from 'pdfkit';
import { Invoice } from '../models/Invoice.js';

// Fixed seller state for GST calculation
const SELLER_STATE = 'Karnataka';

// Pricing configuration
const PRICING = {
  saas: {
    basic: 20000,      // ₹20,000 / month per location
    standard: 50000,   // ₹50,000 / month per location
    enterprise: 150000 // ₹1,50,000 / month per location
  },
  support: {
    standard: 5000,    // ₹5,000 / location / month
    priority: 10000    // ₹10,000 / location / month
  },
  setup: {
    government: 20000, // ₹20,000 per location
    private: 40000     // ₹40,000 per location
  }
};

export class InvoiceService {
  /**
   * Calculate institutional revenue based on LineLess pricing logic
   * @param {Object} institutionInput - Institutional service parameters
   * @returns {Object} Detailed invoice calculation with breakdown
   */
  static calculateInstitutionalRevenue(institutionInput) {
    const {
      org_type,                      // "government" | "private"
      plan_type,                      // "basic" | "standard" | "enterprise"
      service_locations,              // int
      counters_per_location,          // int
      monthly_volume_per_location,    // int
      usage_fee_per_transaction = 1.5, // default ₹1.5
      support_level = "standard",     // "standard" | "priority"
      billing_cycle = "monthly",      // "monthly" | "annual"
      state,                          // buyer state for GST
      is_first_invoice = true         // whether to include setup fee
    } = institutionInput;

    // Validation
    if (!org_type || !plan_type || !service_locations || !state) {
      throw new Error('Missing required fields: org_type, plan_type, service_locations, state');
    }

    // 1. BASE SAAS SUBSCRIPTION MONTHLY
    const saasMonthly = (PRICING.saas[plan_type] || 0) * service_locations;

    // 2. USAGE-BASED FEE MONTHLY
    const usageMonthly = monthly_volume_per_location * service_locations * usage_fee_per_transaction;

    // 3. SUPPORT & MAINTENANCE MONTHLY
    const supportMonthly = (PRICING.support[support_level] || 0) * service_locations;

    // 4. SETUP FEE (only if first invoice)
    const setupFee = is_first_invoice ? (PRICING.setup[org_type] || 0) * service_locations : 0;

    // 5. MONTHLY SUBTOTAL (before tax)
    const monthlySubtotal = saasMonthly + usageMonthly + supportMonthly;

    // 6. FIRST INVOICE SUBTOTAL (includes setup)
    const firstInvoiceSubtotal = monthlySubtotal + setupFee;

    // 7. ANNUAL SUBTOTAL
    const annualSubtotal = billing_cycle === 'annual' ? monthlySubtotal * 12 : null;

    // 8. GST CALCULATION
    const gstConfig = this.calculateGST(state, firstInvoiceSubtotal);

    // 9. GRAND TOTAL
    const gstAmount = this.roundToTwo(firstInvoiceSubtotal * (gstConfig.rate / 100));
    const grandTotal = this.roundToTwo(firstInvoiceSubtotal + gstAmount);

    return {
      // Breakdown
      base_saas: this.roundToTwo(saasMonthly),
      usage_fee: this.roundToTwo(usageMonthly),
      support_fee: this.roundToTwo(supportMonthly),
      setup_fee: this.roundToTwo(setupFee),
      
      // Subtotals
      subtotal: this.roundToTwo(firstInvoiceSubtotal),
      monthly_total: this.roundToTwo(monthlySubtotal),
      annual_total: annualSubtotal ? this.roundToTwo(annualSubtotal) : null,
      
      // Tax
      gst_type: gstConfig.type,
      gst_percentage: gstConfig.rate,
      gst_amount: gstAmount,
      
      // Final total
      grand_total: grandTotal,
      
      // Metadata
      currency: '₹',
      billing_cycle: billing_cycle,
      organization_type: org_type,
      plan: plan_type,
      service_locations: service_locations,
      support_level: support_level,
      buyer_state: state,
      seller_state: SELLER_STATE
    };
  }

  /**
   * Calculate GST based on buyer and seller state
   * @param {string} buyerState - Buyer's state
   * @param {number} taxableAmount - Amount to tax
   * @returns {Object} GST configuration
   */
  static calculateGST(buyerState, taxableAmount) {
    if (buyerState === SELLER_STATE) {
      return {
        type: 'CGST+SGST',
        cgst: 9,
        sgst: 9,
        rate: 18
      };
    } else {
      return {
        type: 'IGST',
        igst: 18,
        rate: 18
      };
    }
  }

  /**
   * Round currency values to 2 decimals
   */
  static roundToTwo(value) {
    return Math.round(value * 100) / 100;
  }

  /**
   * Generate institutional invoice PDF
   * @param {Object} invoiceData - Invoice data with calculations
   * @param {Stream} outputStream - Output stream for PDF
   */
  static generateInstitutionalPDF(invoiceData, outputStream) {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    doc.pipe(outputStream);

    // Header
    doc.fontSize(28).font('Helvetica-Bold').text('INVESTMENT ESTIMATION', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('Service Cost with Tax Breakdown', { align: 'center' });
    doc.moveDown(0.5);

    // Company info
    const pageWidth = doc.page.width;
    const leftX = 40;
    const rightX = pageWidth - 200;

    doc.fontSize(11).font('Helvetica-Bold').text('LineLess Services', leftX);
    doc.fontSize(9).font('Helvetica')
      .text('Digital Public Infrastructure Platform', leftX)
      .text('services@lineless.com', leftX);

    doc.fontSize(10).font('Helvetica-Bold').text(`Estimation ID: ${invoiceData.id}`, rightX, doc.y - 27);
    doc.fontSize(9).font('Helvetica').text(`Date: ${new Date().toLocaleDateString()}`, rightX, { width: 160 });
    
    doc.moveDown(1.5);

    // Bill To section
    doc.fontSize(11).font('Helvetica-Bold').text('BILL TO:', leftX);
    doc.fontSize(9).font('Helvetica')
      .text(`Organization: ${invoiceData.organizationName}`, leftX)
      .text(`Type: ${invoiceData.organizationType.toUpperCase()}`, leftX)
      .text(`State: ${invoiceData.state}`, leftX);

    doc.moveDown(1.5);

    // Pricing breakdown table
    this.drawInstitutionalTable(doc, invoiceData, leftX, pageWidth);

    doc.moveDown(1);

    // Summary section
    this.drawInstitutionalSummary(doc, invoiceData, rightX);

    doc.moveDown(2);

    // Footer
    doc.fontSize(8).font('Helvetica').text('This is an automated estimation for institutional evaluation purposes.', { align: 'center' });
    doc.text('Actual pricing may vary based on final configuration review.', { align: 'center' });

    doc.end();
  }

  /**
   * Draw institutional pricing table
   */
  static drawInstitutionalTable(doc, data, leftX, pageWidth) {
    const tableWidth = pageWidth - 80;
    const rowHeight = 20;
    const col1 = 300;
    const col2 = 120;

    // Header
    doc.rect(leftX, doc.y, tableWidth, rowHeight).stroke();
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('SERVICE COMPONENT', leftX + 10, doc.y + 4);
    doc.text('AMOUNT (₹)', leftX + col1 + 10, doc.y - 16);
    doc.moveDown(1);

    // Items
    doc.font('Helvetica').fontSize(9);
    const items = [
      ['SaaS Subscription (Monthly)', data.calculations.base_saas],
      ['Usage-based Service Fee', data.calculations.usage_fee],
      ['Support & Maintenance', data.calculations.support_fee],
      ...(data.calculations.setup_fee > 0 ? [['Deployment / Setup Fee', data.calculations.setup_fee]] : []),
      ['─────────────────────────', '─────────'],
      ['Subtotal', data.calculations.subtotal]
    ];

    items.forEach(([label, amount]) => {
      const yPos = doc.y;
      doc.rect(leftX, yPos, tableWidth, rowHeight).stroke();
      
      if (label.includes('─')) {
        doc.fontSize(8);
        doc.text(label, leftX + 10, yPos + 4);
      } else {
        doc.fontSize(9);
        doc.text(label, leftX + 10, yPos + 4);
        if (label.includes('Subtotal')) {
          doc.font('Helvetica-Bold');
        }
        doc.text(`₹ ${amount.toFixed(2)}`, leftX + col1 + 10, yPos + 4, { align: 'right' });
        doc.font('Helvetica');
      }
      
      doc.moveDown(1);
    });

    // GST section
    doc.moveDown(0.3);
    const gstYPos = doc.y;
    const gstLabel = data.calculations.gst_type === 'CGST+SGST' 
      ? `CGST + SGST (9% + 9%)` 
      : `IGST (18%)`;
    
    doc.rect(leftX, gstYPos, tableWidth, rowHeight).stroke();
    doc.fontSize(9).font('Helvetica-Bold').text(gstLabel, leftX + 10, gstYPos + 4);
    doc.text(`₹ ${data.calculations.gst_amount.toFixed(2)}`, leftX + col1 + 10, gstYPos + 4, { align: 'right' });
    doc.moveDown(1);

    // Total
    const totalYPos = doc.y;
    doc.rect(leftX, totalYPos, tableWidth, rowHeight).stroke();
    doc.fontSize(11).font('Helvetica-Bold').fillColor('#0066cc');
    doc.text('GRAND TOTAL (First Invoice)', leftX + 10, totalYPos + 4);
    doc.fontSize(12).text(`₹ ${data.calculations.grand_total.toFixed(2)}`, leftX + col1 + 10, totalYPos + 2, { align: 'right' });
    doc.fillColor('#000000');
  }

  /**
   * Draw institutional summary
   */
  static drawInstitutionalSummary(doc, data, rightX) {
    const summaryWidth = 200;
    doc.fontSize(10).font('Helvetica-Bold').text('MONTHLY RECURRING:', rightX);
    doc.fontSize(9).font('Helvetica').text(`₹ ${data.calculations.monthly_total.toFixed(2)}/month`, rightX);
    
    doc.moveDown(0.5);
    
    if (data.calculations.annual_total) {
      doc.fontSize(10).font('Helvetica-Bold').text('ANNUAL COST (12 months):', rightX);
      doc.fontSize(9).font('Helvetica').text(`₹ ${data.calculations.annual_total.toFixed(2)}/year`, rightX);
    }

    doc.moveDown(1);

    // Configuration summary
    doc.fontSize(10).font('Helvetica-Bold').text('CONFIGURATION:', rightX);
    doc.fontSize(8).font('Helvetica')
      .text(`Service Locations: ${data.service_locations}`, rightX)
      .text(`Counters/Location: ${data.counters_per_location}`, rightX)
      .text(`Monthly Volume: ${data.monthly_volume_per_location.toLocaleString()} transactions`, rightX)
      .text(`Plan: ${data.plan_type.toUpperCase()}`, rightX)
      .text(`Support: ${data.support_level.toUpperCase()}`, rightX);
  }

  /**
   * Generate invoice PDF stream
   * @param {Object} invoiceData - Invoice data
   * @param {Stream} outputStream - Output stream for PDF
   */
  static generateInvoicePDF(invoiceData, outputStream) {
    const invoice = new Invoice(invoiceData);
    const doc = new PDFDocument({ margin: 50 });
    
    doc.pipe(outputStream);

    // Header
    doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').text('Professional Services Invoice', { align: 'center' });
    
    doc.moveDown(1);

    // Invoice details
    const pageWidth = doc.page.width;
    const leftX = 50;
    const rightX = pageWidth - 250;

    // Left side - Company info
    doc.fontSize(12).font('Helvetica-Bold').text('LINELESS SERVICES', leftX);
    doc.fontSize(10).font('Helvetica')
      .text('Professional Service Provider', leftX)
      .text('Email: services@lineless.com', leftX)
      .text('Phone: +1 (XXX) XXX-XXXX', leftX);

    // Right side - Invoice info
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text(`Invoice #`, rightX);
    doc.text(`Date`, rightX);
    doc.text(`Due Date`, rightX);
    doc.text(`Status`, rightX);

    doc.font('Helvetica');
    doc.text(`${invoice.id}`, rightX + 80);
    doc.text(`${new Date(invoice.invoiceDate).toLocaleDateString()}`, rightX + 80);
    doc.text(`${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}`, rightX + 80);
    doc.text(`${invoice.status.toUpperCase()}`, rightX + 80);

    doc.moveDown(1);

    // Bill To
    doc.fontSize(12).font('Helvetica-Bold').text('BILL TO:', leftX);
    doc.fontSize(10).font('Helvetica')
      .text(`${invoice.organizationName}`, leftX)
      .text(`Organization Type: ${invoice.organizationType}`, leftX);

    doc.moveDown(1);

    // Items table
    this.drawTable(doc, invoice);

    doc.moveDown(1);

    // Summary calculations
    const summary = invoice.getSummary();
    this.drawSummary(doc, summary, rightX);

    // Notes
    if (invoice.notes) {
      doc.moveDown(1);
      doc.fontSize(10).font('Helvetica-Bold').text('Notes:', leftX);
      doc.font('Helvetica').text(invoice.notes, leftX, { width: pageWidth - 100 });
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(8).font('Helvetica').text('Thank you for your business!', { align: 'center' });
    doc.text('This is a digitally generated invoice', { align: 'center' });

    doc.end();
  }

  static drawTable(doc, invoice) {
    const leftX = 50;
    const tableWidth = doc.page.width - 100;
    const rowHeight = 25;
    const colWidths = {
      description: tableWidth * 0.45,
      quantity: tableWidth * 0.15,
      unitPrice: tableWidth * 0.15,
      total: tableWidth * 0.25,
    };

    // Header
    doc.rect(leftX, doc.y, tableWidth, rowHeight).stroke();
    doc.fontSize(10).font('Helvetica-Bold');
    
    let currentX = leftX + 5;
    doc.text('Description', currentX, doc.y + 5);
    currentX += colWidths.description;
    doc.text('Qty', currentX, doc.y + 5);
    currentX += colWidths.quantity;
    doc.text('Unit Price', currentX, doc.y + 5);
    currentX += colWidths.unitPrice;
    doc.text('Total', currentX, doc.y + 5);

    doc.moveDown(1);

    // Items
    doc.font('Helvetica').fontSize(9);
    invoice.items.forEach((item, index) => {
      const yPosition = doc.y;
      doc.rect(leftX, yPosition, tableWidth, rowHeight).stroke();

      currentX = leftX + 5;
      doc.text(item.description, currentX, yPosition + 5, { width: colWidths.description - 10 });
      currentX += colWidths.description;
      doc.text(item.quantity.toString(), currentX, yPosition + 5);
      currentX += colWidths.quantity;
      doc.text(`$${item.unitPrice.toFixed(2)}`, currentX, yPosition + 5);
      currentX += colWidths.unitPrice;
      doc.text(`$${(item.quantity * item.unitPrice).toFixed(2)}`, currentX, yPosition + 5);

      doc.moveDown(1);
    });
  }

  static drawSummary(doc, summary, rightX) {
    const lineWidth = 150;
    doc.fontSize(10).font('Helvetica');

    doc.text('Subtotal:', rightX, { align: 'right', width: lineWidth - 60 });
    doc.text(`$${summary.subtotal.toFixed(2)}`, rightX + lineWidth - 60, doc.y - 12, { align: 'right', width: 60 });

    if (summary.discountPercentage > 0) {
      doc.text(`Discount (${summary.discountPercentage}%):`, rightX, { align: 'right', width: lineWidth - 60 });
      doc.text(`-$${summary.discount.toFixed(2)}`, rightX + lineWidth - 60, doc.y - 12, { align: 'right', width: 60 });
    }

    doc.text(`Tax (${summary.taxPercentage}%):`, rightX, { align: 'right', width: lineWidth - 60 });
    doc.text(`$${summary.tax.toFixed(2)}`, rightX + lineWidth - 60, doc.y - 12, { align: 'right', width: 60 });

    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('Total Due:', rightX, { align: 'right', width: lineWidth - 60 });
    doc.text(`$${summary.total.toFixed(2)}`, rightX + lineWidth - 60, doc.y - 14, { align: 'right', width: 60 });
  }

  /**
   * Generate invoice estimation
   * @param {Object} estimationData
   * @returns {Object} Estimation with all costs breakdown
   */
  static generateEstimation(estimationData) {
    const invoice = new Invoice(estimationData);
    const summary = invoice.getSummary();

    return {
      id: invoice.id,
      organizationName: invoice.organizationName,
      organizationType: invoice.organizationType,
      items: invoice.items,
      estimation: {
        subtotal: parseFloat(summary.subtotal.toFixed(2)),
        discountPercentage: summary.discountPercentage,
        discountAmount: parseFloat(summary.discount.toFixed(2)),
        taxPercentage: summary.taxPercentage,
        taxAmount: parseFloat(summary.tax.toFixed(2)),
        totalInvestmentNeeded: parseFloat(summary.total.toFixed(2)),
        generatedAt: new Date().toISOString(),
      }
    };
  }
}
