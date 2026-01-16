import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceService } from '../services/InvoiceService.js';
import { Invoice } from '../models/Invoice.js';

const router = express.Router();

/**
 * POST /api/invoices/institutional
 * Generate institutional investment estimation with PDF download
 * Implements LineLess revenue model for B2G/B2B
 */
router.post('/institutional', (req, res) => {
  try {
    const {
      organizationName,
      organizationType,      // "government" | "private"
      org_type,              // alternative naming
      plan_type,             // "basic" | "standard" | "enterprise"
      service_locations,
      counters_per_location,
      monthly_volume_per_location,
      usage_fee_per_transaction = 1.5,
      support_level = "standard",
      billing_cycle = "monthly",
      state,
      is_first_invoice = true,
      downloadPDF = false
    } = req.body;

    // Normalize org_type
    const normalizedOrgType = org_type || organizationType;
    if (!normalizedOrgType || !plan_type || !service_locations || !state) {
      return res.status(400).json({
        error: 'Missing required fields: organizationType, plan_type, service_locations, state'
      });
    }

    // Calculate revenue
    const calculations = InvoiceService.calculateInstitutionalRevenue({
      org_type: normalizedOrgType.toLowerCase(),
      plan_type: plan_type.toLowerCase(),
      service_locations: parseInt(service_locations),
      counters_per_location: parseInt(counters_per_location) || 0,
      monthly_volume_per_location: parseInt(monthly_volume_per_location) || 0,
      usage_fee_per_transaction: parseFloat(usage_fee_per_transaction),
      support_level: support_level.toLowerCase(),
      billing_cycle: billing_cycle.toLowerCase(),
      state,
      is_first_invoice
    });

    const estimationId = `EST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const invoiceData = {
      id: estimationId,
      organizationName,
      organizationType: normalizedOrgType,
      state,
      plan_type,
      service_locations,
      counters_per_location,
      monthly_volume_per_location,
      support_level,
      calculations,
      generatedAt: new Date().toISOString()
    };

    // If PDF download requested, generate and download
    if (downloadPDF) {
      const fileName = `LineLess_Estimation_${estimationId}_${Date.now()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      InvoiceService.generateInstitutionalPDF(invoiceData, res);
    } else {
      // Return JSON for preview
      res.json({
        success: true,
        estimation: {
          id: estimationId,
          organizationName,
          organizationType: normalizedOrgType,
          state,
          ...calculations,
          generatedAt: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    console.error('Institutional estimation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate estimation' });
  }
});

/**
 * POST /api/invoices/institutional/download
 * Download institutional invoice as PDF
 */
router.post('/institutional/download', (req, res) => {
  try {
    const {
      organizationName,
      organizationType,
      plan_type,
      service_locations,
      counters_per_location,
      monthly_volume_per_location,
      usage_fee_per_transaction = 1.5,
      support_level = "standard",
      billing_cycle = "monthly",
      state,
      is_first_invoice = true
    } = req.body;

    // Calculate revenue
    const calculations = InvoiceService.calculateInstitutionalRevenue({
      org_type: organizationType.toLowerCase(),
      plan_type: plan_type.toLowerCase(),
      service_locations: parseInt(service_locations),
      counters_per_location: parseInt(counters_per_location) || 0,
      monthly_volume_per_location: parseInt(monthly_volume_per_location) || 0,
      usage_fee_per_transaction: parseFloat(usage_fee_per_transaction),
      support_level: support_level.toLowerCase(),
      billing_cycle: billing_cycle.toLowerCase(),
      state,
      is_first_invoice
    });

    const estimationId = `EST-${uuidv4().slice(0, 8).toUpperCase()}`;
    const invoiceData = {
      id: estimationId,
      organizationName,
      organizationType,
      state,
      plan_type,
      service_locations,
      counters_per_location,
      monthly_volume_per_location,
      support_level,
      calculations,
      generatedAt: new Date().toISOString()
    };

    const fileName = `LineLess_Estimation_${estimationId}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    InvoiceService.generateInstitutionalPDF(invoiceData, res);
  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate PDF' });
  }
});

/**
 * POST /api/invoices/estimate
 * Generate an invoice estimation with all expenses and tax breakdown
 */
router.post('/estimate', (req, res) => {
  try {
    const {
      organizationName,
      organizationType, // 'business' or 'government'
      items, // [{description, quantity, unitPrice}]
      taxPercentage = 18,
      discountPercentage = 0,
      dueDate,
      notes
    } = req.body;

    // Validation
    if (!organizationName || !organizationType || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: organizationName, organizationType, items'
      });
    }

    const invoiceData = {
      id: `EST-${uuidv4().slice(0, 8).toUpperCase()}`,
      organizationName,
      organizationType,
      items,
      taxPercentage,
      discountPercentage,
      dueDate,
      notes,
      status: 'estimation'
    };

    const estimation = InvoiceService.generateEstimation(invoiceData);

    res.json({
      success: true,
      data: estimation
    });
  } catch (error) {
    console.error('Estimation error:', error);
    res.status(500).json({ error: 'Failed to generate estimation' });
  }
});

/**
 * POST /api/invoices/generate
 * Generate a PDF invoice for download
 */
router.post('/generate', (req, res) => {
  try {
    const {
      organizationName,
      organizationType,
      items,
      taxPercentage = 18,
      discountPercentage = 0,
      invoiceDate,
      dueDate,
      notes
    } = req.body;

    // Validation
    if (!organizationName || !organizationType || !items || items.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: organizationName, organizationType, items'
      });
    }

    const invoiceData = {
      id: `INV-${uuidv4().slice(0, 8).toUpperCase()}`,
      organizationName,
      organizationType,
      items,
      taxPercentage,
      discountPercentage,
      invoiceDate,
      dueDate,
      notes,
      status: 'pending'
    };

    // Set response headers for PDF download
    const fileName = `Invoice_${invoiceData.id}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Generate PDF
    InvoiceService.generateInvoicePDF(invoiceData, res);
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

/**
 * POST /api/invoices/calculate
 * Calculate invoice totals without generating PDF
 */
router.post('/calculate', (req, res) => {
  try {
    const {
      items,
      taxPercentage = 18,
      discountPercentage = 0
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required' });
    }

    const invoice = new Invoice({
      id: 'CALC-TEMP',
      organizationName: 'Calculation',
      organizationType: 'business',
      items,
      taxPercentage,
      discountPercentage
    });

    const summary = invoice.getSummary();

    res.json({
      success: true,
      calculations: {
        items: items.map(item => ({
          ...item,
          lineTotal: item.quantity * item.unitPrice
        })),
        summary: {
          subtotal: parseFloat(summary.subtotal.toFixed(2)),
          discountPercentage: summary.discountPercentage,
          discountAmount: parseFloat(summary.discount.toFixed(2)),
          taxPercentage: summary.taxPercentage,
          taxAmount: parseFloat(summary.tax.toFixed(2)),
          total: parseFloat(summary.total.toFixed(2))
        }
      }
    });
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate invoice' });
  }
});

export default router;
