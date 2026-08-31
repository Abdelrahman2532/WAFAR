/**
 * WAFAR Apartment & Smart Lamp Controller
 */

let lampState = null;

document.addEventListener('DOMContentLoaded', async () => {
  await initDevicesPage();

  window.addEventListener('wafar:langchange', () => {
    updateLampFloorplanUI();
  });
});

async function initDevicesPage() {
  lampState = await DevicesAPI.getLampState();
  updateLampFloorplanUI();
}

function updateLampFloorplanUI() {
  if (!lampState) return;

  const bedroomCell = document.getElementById('bedroomRoomCell');
  const stateBadge = document.getElementById('lampStateBadge');
  const lampBtn = document.getElementById('lampToggleBtn');
  const powerVal = document.getElementById('lampPowerVal');
  const navBadge = document.getElementById('devicesSidebarBadge');

  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  if (bedroomCell) {
    bedroomCell.className = `floor-room has-device ${lampState.state ? 'is-on' : 'is-off'}`;
  }

  if (stateBadge) {
    stateBadge.className = `badge ${lampState.state ? 'badge-success' : 'badge-neutral'}`;
    stateBadge.textContent = lampState.state ? (isAr ? 'شغّال' : 'ON') : (isAr ? 'مُغلق' : 'OFF');
  }

  if (lampBtn) {
    lampBtn.className = lampState.state ? 'btn btn-secondary btn-sm' : 'btn btn-primary btn-sm';
    lampBtn.textContent = lampState.state ? 
      (isAr ? 'اقفل اللمبة' : 'Turn Off') : 
      (isAr ? 'شغّل اللمبة' : 'Turn On');
  }

  if (powerVal) {
    powerVal.textContent = `${lampState.powerWatts} W`;
  }

  if (navBadge) {
    navBadge.textContent = lampState.state ? (isAr ? 'شغّال' : 'ON') : (isAr ? 'مُغلق' : 'OFF');
  }
}

async function toggleBedroomLamp() {
  const res = await DevicesAPI.toggleLamp(!lampState.state);
  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

  if (res.success) {
    lampState = res.lamp;
    updateLampFloorplanUI();
    WafarUI.showToast(
      lampState.state ? 
        (isAr ? 'تم تشغيل مصباح أوضة النوم (15 واط)' : 'Bedroom Smart Lamp turned ON (15W)') : 
        (isAr ? 'تم إطفاء مصباح أوضة النوم' : 'Bedroom Smart Lamp turned OFF'),
      lampState.state ? 'success' : 'info'
    );
  }
}
