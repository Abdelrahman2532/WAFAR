/**
 * WAFAR Points & Bill Discount Controller
 */

let pointsData = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initPointsPage();

  window.addEventListener('wafar:langchange', () => {
    renderPointsUI();
  });
});

async function initPointsPage() {
  pointsData = await PointsAPI.getPointsSummary();
  renderPointsUI();
}

function renderPointsUI() {
  if (!pointsData) return;

  const balanceEl = document.getElementById('pointsBalanceVal');
  const discountEl = document.getElementById('discountValDisplay');
  const tbody = document.getElementById('pointsHistoryTbody');

  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  if (balanceEl) balanceEl.textContent = pointsData.points;
  if (discountEl) {
    discountEl.textContent = `${pointsData.discountEGP.toFixed(2)} ${isAr ? 'جنيه' : 'EGP'}`;
  }

  if (tbody) {
    tbody.innerHTML = pointsData.history.map(item => `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.88rem;">${item.action}</div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${item.date}</div>
        </td>
        <td style="text-align: end;">
          <span class="badge badge-primary" style="font-size: 0.8rem; font-weight: 800;">
            ${item.points} (${item.egpValue})
          </span>
        </td>
      </tr>
    `).join('');
  }
}
