/**
 * WAFAR Billing & Points Discount Controller
 */

let selectedMethod = 'vodafone';
let billingData = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initBillingPage();

  window.addEventListener('wafar:langchange', () => {
    renderBillingBreakdown();
    renderInvoicesTable();
  });
});

async function initBillingPage() {
  billingData = await BillingAPI.getBillingSummary();
  renderBillingBreakdown();
  renderInvoicesTable();
}

function renderBillingBreakdown() {
  if (!billingData) return;

  const bill = billingData.currentBill;
  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
  const curr = isAr ? 'جنيه' : 'EGP';

  const origEl = document.getElementById('origBillDisplay');
  const discountEl = document.getElementById('wafarDiscountDisplay');
  const netEl = document.getElementById('netToPayDisplay');
  const badgeEl = document.getElementById('billStatusBadge');
  const payBtn = document.getElementById('payBillMainBtn');

  if (origEl) origEl.textContent = `${bill.originalAmountEGP.toFixed(2)} ${curr}`;
  if (discountEl) discountEl.textContent = `-${bill.wafarDiscountEGP.toFixed(2)} ${curr}`;
  if (netEl) netEl.textContent = `${bill.netAmountEGP.toFixed(2)} ${curr}`;

  if (bill.status === 'paid') {
    if (badgeEl) {
      badgeEl.className = 'badge badge-success';
      badgeEl.textContent = isAr ? 'تم الدفع' : 'Paid';
    }
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.style.opacity = '0.6';
      payBtn.textContent = isAr ? '✓ تم سداد الفاتورة' : '✓ Bill Paid';
    }
  }
}

function renderInvoicesTable() {
  const tbody = document.getElementById('invoicesTbody');
  if (!tbody || !billingData) return;

  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
  const curr = isAr ? 'جنيه' : 'EGP';

  tbody.innerHTML = billingData.invoices.map(inv => `
    <tr>
      <td><strong>${inv.id}</strong></td>
      <td>${inv.month}</td>
      <td>${inv.kwh} kWh</td>
      <td><strong>${inv.amountEGP.toFixed(2)} ${curr}</strong></td>
      <td>
        <span class="badge ${inv.isPaid ? 'badge-success' : 'badge-gold'}">
          ${inv.isPaid ? (isAr ? 'مدفوعة' : 'Paid') : (isAr ? 'مستحقة قريباً' : 'Due Soon')}
        </span>
      </td>
    </tr>
  `).join('');
}

function selectPaymentMethod(method, el) {
  selectedMethod = method;
  document.querySelectorAll('.payment-method-card').forEach(card => card.classList.remove('selected'));
  if (el) el.classList.add('selected');
}

function openPaymentModal() {
  if (billingData && billingData.currentBill.status === 'paid') {
    WafarUI.showToast("Current bill is already paid.", "info");
    return;
  }

  const fieldsArea = document.getElementById('paymentFieldsArea');
  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  if (selectedMethod === 'vodafone') {
    fieldsArea.innerHTML = `
      <div class="form-group">
        <label class="form-label">${isAr ? 'رقم محفظة فودافون كاش' : 'Vodafone Cash Wallet Number'}</label>
        <input type="tel" class="form-control" placeholder="010XXXXXXXX" value="01012345678" required>
      </div>
    `;
  } else if (selectedMethod === 'instapay') {
    fieldsArea.innerHTML = `
      <div class="form-group">
        <label class="form-label">${isAr ? 'عنوان الدفع اللحظي (IPA) أو رقم الموبايل' : 'InstaPay IPA or Mobile'}</label>
        <input type="text" class="form-control" placeholder="username@instapay" value="abdalla@instapay" required>
      </div>
    `;
  } else {
    fieldsArea.innerHTML = `
      <div class="form-group">
        <label class="form-label">${isAr ? 'رقم الكارت البنكي' : 'Card Number'}</label>
        <input type="text" class="form-control" placeholder="•••• •••• •••• ••••" value="5123 •••• •••• 9876" required>
      </div>
    `;
  }

  WafarUI.openModal('paymentModal');
}

async function confirmPaymentSubmit() {
  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
  WafarUI.closeModal('paymentModal');

  const res = await BillingAPI.payBill(selectedMethod);
  if (res.success) {
    billingData = await BillingAPI.getBillingSummary();
    renderBillingBreakdown();
    renderInvoicesTable();
    WafarUI.showToast(
      isAr ? `تم سداد ${res.amount.toFixed(2)} جنيه بنجاح!` : `Paid ${res.amount.toFixed(2)} EGP successfully!`, 
      'success'
    );
  }
}
