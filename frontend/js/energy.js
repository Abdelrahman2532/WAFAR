/**
 * WAFAR Energy Analytics Controller
 */

let selectedPeriod = 'month';
let analyticsData = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initEnergyPage();

  window.addEventListener('wafar:langchange', () => {
    renderKPIs();
    renderEnergyChart();
    renderWeeklyTable();
  });

  window.addEventListener('wafar:themechange', () => {
    renderEnergyChart();
  });
});

async function initEnergyPage() {
  analyticsData = await EnergyAPI.getAnalytics(selectedPeriod);
  renderKPIs();
  renderEnergyChart();
  renderWeeklyTable();
}

function renderKPIs() {
  if (!analyticsData) return;

  const totalEl = document.getElementById('statTotalKWh');
  const avgEl = document.getElementById('statDailyAvg');
  const costEl = document.getElementById('statTotalCost');
  const carbonEl = document.getElementById('statCarbon');

  if (totalEl) totalEl.textContent = analyticsData.totalConsumptionKWh.toFixed(1);
  if (avgEl) avgEl.textContent = analyticsData.averageDailyKWh.toFixed(1);
  if (costEl) costEl.textContent = analyticsData.totalCostSAR.toFixed(2);
  if (carbonEl) carbonEl.textContent = analyticsData.carbonOffsetKg.toFixed(1);
}

// --------------------------------------------------------------------------
// Canvas Energy Analytics Chart
// --------------------------------------------------------------------------
function renderEnergyChart() {
  const canvas = document.getElementById('energyAnalyticsChart');
  if (!canvas || !analyticsData) return;

  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = { top: 20, right: 25, bottom: 35, left: 40 };

  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  ctx.clearRect(0, 0, w, h);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const data = analyticsData.weeklyComparison;
  const maxVal = 25;
  const steps = 4;

  // Grid Lines & Y-Axis Labels
  ctx.strokeStyle = isDark ? '#1f3329' : '#edf2ee';
  ctx.lineWidth = 1;
  ctx.fillStyle = isDark ? '#6b8577' : '#7c8e84';
  ctx.font = '10px -apple-system, sans-serif';

  for (let i = 0; i <= steps; i++) {
    const yVal = (maxVal / steps) * i;
    const yPos = padding.top + plotH - (i / steps) * plotH;

    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(w - padding.right, yPos);
    ctx.stroke();

    ctx.fillText(`${yVal.toFixed(0)}k`, 10, yPos + 3);
  }

  // Draw Baseline Line (Dashed Gray)
  ctx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  data.forEach((pt, idx) => {
    const x = padding.left + (idx / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.previous / maxVal) * plotH;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Actual Consumption Area Gradient
  const grad = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  grad.addColorStop(0, isDark ? 'rgba(45, 106, 80, 0.45)' : 'rgba(27, 61, 47, 0.28)');
  grad.addColorStop(1, 'rgba(27, 61, 47, 0.01)');

  ctx.beginPath();
  data.forEach((pt, idx) => {
    const x = padding.left + (idx / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.current / maxVal) * plotH;
    if (idx === 0) {
      ctx.moveTo(x, padding.top + plotH);
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.lineTo(padding.left + plotW, padding.top + plotH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Actual Solid Line
  ctx.beginPath();
  data.forEach((pt, idx) => {
    const x = padding.left + (idx / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.current / maxVal) * plotH;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = isDark ? '#34d399' : '#1b3d2f';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw Data Points and X-Axis Labels
  data.forEach((pt, idx) => {
    const x = padding.left + (idx / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.current / maxVal) * plotH;

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#34d399' : '#1b3d2f';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#15221b' : '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isDark ? '#9cb5a7' : '#4a5d53';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pt.label, x, h - 12);
  });
}

function renderWeeklyTable() {
  const tbody = document.getElementById('weeklyTableBody');
  if (!tbody || !analyticsData) return;

  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  tbody.innerHTML = analyticsData.weeklyComparison.map(row => {
    const diffPerc = (((row.current - row.previous) / row.previous) * 100).toFixed(1);
    const isSaved = row.current <= row.previous;
    const cost = (row.current * 0.24).toFixed(2);

    return `
      <tr>
        <td><strong>${row.label}</strong></td>
        <td>${row.current} kWh</td>
        <td style="color: var(--text-muted);">${row.previous} kWh</td>
        <td>
          <span class="trend-pill ${isSaved ? 'positive' : 'negative'}">
            ${isSaved ? '↓' : '↑'} ${Math.abs(diffPerc)}%
          </span>
        </td>
        <td>SAR ${cost}</td>
        <td>
          <span class="badge ${isSaved ? 'badge-success' : 'badge-warning'}">
            ${isSaved ? (isAr ? 'مثالي' : 'Optimal') : (isAr ? 'مرتفع' : 'Higher')}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

async function changePeriod(period, btn) {
  selectedPeriod = period;
  document.querySelectorAll('#timePeriodSelector .filter-pill').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  analyticsData = await EnergyAPI.getAnalytics(period);
  renderKPIs();
  renderEnergyChart();
}
