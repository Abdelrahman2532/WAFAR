/**
 * WAFAR Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initDashboard();

  window.addEventListener('wafar:langchange', async () => {
    await renderDashboardChart();
    await updateDashLampWidget();
    await loadRecentActivity();
  });

  window.addEventListener('wafar:themechange', async () => {
    await renderDashboardChart();
  });
});

async function initDashboard() {
  await renderDashboardChart();
  await updateDashLampWidget();
  await loadRecentActivity();
}

async function updateDashLampWidget() {
  const lamp = await DevicesAPI.getLampState();
  const badge = document.getElementById('dashLampStateBadge');
  const watts = document.getElementById('dashLampWatts');
  const btn = document.getElementById('dashLampBtn');
  const navBadge = document.getElementById('lampNavBadge');

  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  if (badge) {
    badge.className = `badge ${lamp.state ? 'badge-success' : 'badge-neutral'}`;
    badge.textContent = lamp.state ? (isAr ? 'شغّال' : 'ON') : (isAr ? 'مُغلق' : 'OFF');
  }

  if (watts) {
    watts.textContent = `${lamp.powerWatts} W`;
  }

  if (btn) {
    btn.className = lamp.state ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
    btn.textContent = lamp.state ? 
      (isAr ? 'اقفل اللمبة' : 'Turn Off') : 
      (isAr ? 'شغّل اللمبة' : 'Turn On');
  }

  if (navBadge) {
    navBadge.textContent = lamp.state ? (isAr ? 'شغّال' : 'ON') : (isAr ? 'مُغلق' : 'OFF');
  }
}

async function toggleDashLamp() {
  const current = await DevicesAPI.getLampState();
  const res = await DevicesAPI.toggleLamp(!current.state);
  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  if (res.success) {
    await updateDashLampWidget();
    WafarUI.showToast(
      res.lamp.state ? 
        (isAr ? 'تم تشغيل مصباح أوضة النوم (15 واط)' : 'Bedroom Lamp turned ON (15W)') : 
        (isAr ? 'تم إطفاء مصباح أوضة النوم' : 'Bedroom Lamp turned OFF'),
      res.lamp.state ? 'success' : 'info'
    );
  }
}

// --------------------------------------------------------------------------
// Canvas Energy Chart Engine (Sage Green & Charcoal Dark)
// --------------------------------------------------------------------------
async function renderDashboardChart() {
  const canvas = document.getElementById('dashboardEnergyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const data = await DashboardAPI.getHourlyUsage();

  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = { top: 15, right: 15, bottom: 30, left: 35 };

  const plotW = w - padding.left - padding.right;
  const plotH = h - padding.top - padding.bottom;

  ctx.clearRect(0, 0, w, h);

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  // Grid Lines & Y-Axis Labels
  const maxVal = 3.0;
  const steps = 3;
  ctx.strokeStyle = isDark ? '#2B3028' : '#EDF2E9';
  ctx.lineWidth = 1;
  ctx.fillStyle = isDark ? '#727B6E' : '#9AA196';
  ctx.font = '10px -apple-system, sans-serif';

  for (let i = 0; i <= steps; i++) {
    const yVal = (maxVal / steps) * i;
    const yPos = padding.top + plotH - (i / steps) * plotH;

    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(w - padding.right, yPos);
    ctx.stroke();

    ctx.fillText(`${yVal.toFixed(1)}k`, 4, yPos + 3);
  }

  // Draw Baseline Target (Dashed Gray)
  ctx.strokeStyle = isDark ? '#727B6E' : '#9AA196';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  data.forEach((pt, index) => {
    const x = padding.left + (index / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.baseline / maxVal) * plotH;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Actual Consumption Area & Gradient Line
  const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradient.addColorStop(0, isDark ? 'rgba(145, 174, 120, 0.4)' : 'rgba(111, 143, 91, 0.25)');
  gradient.addColorStop(1, 'rgba(111, 143, 91, 0.01)');

  ctx.beginPath();
  data.forEach((pt, index) => {
    const x = padding.left + (index / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.kwh / maxVal) * plotH;
    if (index === 0) {
      ctx.moveTo(x, padding.top + plotH);
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.lineTo(padding.left + plotW, padding.top + plotH);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw Solid Line for Actual Consumption
  ctx.beginPath();
  data.forEach((pt, index) => {
    const x = padding.left + (index / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.kwh / maxVal) * plotH;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = isDark ? '#91AE78' : '#6F8F5B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Draw Points and X-Axis Labels
  data.forEach((pt, index) => {
    const x = padding.left + (index / (data.length - 1)) * plotW;
    const y = padding.top + plotH - (pt.kwh / maxVal) * plotH;

    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? '#91AE78' : '#6F8F5B';
    ctx.fill();
    ctx.strokeStyle = isDark ? '#1B1F1A' : '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = isDark ? '#A5ADA0' : '#747B70';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(pt.hour, x, h - 8);
  });
}

async function loadRecentActivity() {
  const container = document.getElementById('recentActivityContainer');
  if (!container) return;

  const acts = await DashboardAPI.getRecentActivity();
  container.innerHTML = acts.map(item => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-light); font-size: 0.82rem;">
      <div style="display:flex; align-items:center; gap: 8px;">
        <span class="status-dot active" style="width:6px; height:6px;"></span>
        <span style="color: var(--text-primary);">${item.event}</span>
      </div>
      <span style="font-size: 0.72rem; color: var(--text-muted);">${item.time}</span>
    </div>
  `).join('');
}
