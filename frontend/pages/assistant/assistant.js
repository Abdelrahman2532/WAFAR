function showToast(msg, icon = '✓') {
      const toast = document.getElementById('appToast');
      document.getElementById('toastMsg').innerHTML = msg;
      document.getElementById('toastIcon').textContent = icon;
      toast.classList.add('show');
      clearTimeout(window._toastTimeout);
      window._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2600);
    }

    function initLiveClock() {
      const el = document.getElementById('headerLiveTime');
      function update() {
        const now = new Date();
        const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
        const options = {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        };
        el.textContent = now.toLocaleString(isAr ? 'ar-EG' : 'en-US', options);
      }
      update();
      setInterval(update, 1000);
    }

    function toggleAppTheme() {
      const isDark = document.documentElement.classList.toggle('dark');
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      localStorage.setItem('wafar-theme', isDark ? 'dark' : 'light');
      const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
      showToast(isDark ? (isAr ? 'تم تفعيل الوضع الليلي' : 'Dark Mode Enabled') : (isAr ? 'تم تفعيل الوضع النهاري' : 'Light Mode Enabled'));
    }

    function clearChatHistory() {
      const viewport = document.getElementById('chatViewport');
      const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
      viewport.innerHTML = `
        <img src="../../assets/images/wafar-ai-avatar.png" alt="Watermark" class="chat-watermark">
        <div class="chat-message-row ai">
          <div class="msg-avatar">
            <img src="../../assets/images/wafar-ai-avatar.png" alt="AI Avatar">
          </div>
          <div class="msg-bubble-wrap">
            <div class="msg-bubble-card">
              <strong>${isAr ? 'مرحباً يا عبد الله!' : 'Hello Abdalla!'}</strong><br>
              ${isAr ? 'تم مسح المحادثة السابقة. كيف يمكنني مساعدتك الآن بخصوص ترشيد الطاقة؟' : 'Thread cleared! How can I assist you with your smart energy savings today?'}
            </div>
            <span class="msg-time-stamp">${isAr ? 'الآن' : 'Just now'}</span>
          </div>
        </div>
      `;
      showToast(isAr ? 'تم مسح المحادثة بنجاح' : 'Chat thread cleared', '✓');
    }

    function sendPrompt(text) {
      document.getElementById('chatInput').value = text;
      handleChatSubmit(new Event('submit'));
    }

    function handleChatSubmit(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('chatInput');
      const query = input.value.trim();
      if (!query) return;

      const viewport = document.getElementById('chatViewport');
      const isAr = typeof i18n !== 'undefined' && i18n.isRtl();

      // Append User message
      const userRow = document.createElement('div');
      userRow.className = 'chat-message-row user';
      userRow.innerHTML = `
        <div class="msg-avatar">AM</div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble-card">${escapeHtml(query)}</div>
          <span class="msg-time-stamp">${isAr ? 'الآن' : 'Just now'}</span>
        </div>
      `;
      viewport.appendChild(userRow);
      input.value = '';
      viewport.scrollTop = viewport.scrollHeight;

      // Append AI typing indicator
      const typingRow = document.createElement('div');
      typingRow.className = 'chat-message-row ai';
      typingRow.id = 'aiTypingBubble';
      typingRow.innerHTML = `
        <div class="msg-avatar">
          <img src="../../assets/images/wafar-ai-avatar.png" alt="AI Avatar">
        </div>
        <div class="msg-bubble-wrap">
          <div class="msg-bubble-card" style="display:flex; align-items:center; gap:6px; padding: 12px 18px;">
            <span style="font-size: 12px; color: var(--text-muted);">${isAr ? 'جاري التحليل...' : 'WAFAR AI is analyzing...'}</span>
          </div>
        </div>
      `;
      viewport.appendChild(typingRow);
      viewport.scrollTop = viewport.scrollHeight;

      // Generate intelligent answer based on query
      setTimeout(() => {
        const typingEl = document.getElementById('aiTypingBubble');
        if (typingEl) typingEl.remove();

        const responseText = generateAIResponse(query, isAr);
        const aiRow = document.createElement('div');
        aiRow.className = 'chat-message-row ai';
        aiRow.innerHTML = `
          <div class="msg-avatar">
            <img src="../../assets/images/wafar-ai-avatar.png" alt="AI Avatar">
          </div>
          <div class="msg-bubble-wrap">
            <div class="msg-bubble-card">${responseText}</div>
            <span class="msg-time-stamp">${isAr ? 'الآن' : 'Just now'}</span>
          </div>
        `;
        viewport.appendChild(aiRow);
        viewport.scrollTop = viewport.scrollHeight;
      }, 700);
    }

    function generateAIResponse(query, isAr) {
      const q = query.toLowerCase();
      if (q.includes('save') || q.includes('توفير') || q.includes('ترشيد')) {
        return isAr ? 
          'بناءً على تحليلات <strong>شقة رقم 4</strong> اليوم، يمكنك توفير حتى <strong>2.4 ك.و.س</strong> يومياً بإطفاء مصباح غرفة النوم وقت ضوء النهار، وتشغيل التكييف على درجة 24°C بدلاً من 20°C. هذا سيزيد رصيد نقاطك بـ <strong>+20 نقطة</strong> ويخصم 2 جنيه إضافية من فاتورتك!' : 
          'Based on analytics for <strong>Apartment #4</strong>, you can save up to <strong>2.4 kWh</strong> daily by turning off bedroom lights during daylight and setting your AC to 24°C. This will earn you <strong>+20 WAFAR Points</strong> and reduce your bill by 2 EGP!';
      }
      if (q.includes('average') || q.includes('معدل') || q.includes('استهلاك') || q.includes('daily')) {
        return isAr ? 
          'معدل استهلاكك اليومي الحالي هو <strong>11.90 ك.و.س</strong> وهو أقل بنسبة <strong>18%</strong> مقارنة بالشهر الماضي. كفاءة منزلك ممتازة بمؤشر <strong>92/100</strong>.' : 
          'Your current daily average usage is <strong>11.90 kWh</strong>, which is <strong>18% lower</strong> than last month! Your home efficiency score is <strong>92/100 (Excellent)</strong>.';
      }
      if (q.includes('appliance') || q.includes('أجهزة') || q.includes('وقت') || q.includes('peak')) {
        return isAr ? 
          'أفضل أوقات تشغيل الأجهزة عالية السحب (مثل الغسالة وسخان المياه) هي في غير ساعات الذروة، تحديداً بين <strong>09:00 صباحاً و 01:00 ظهراً</strong> للحصول على مكافآت نقاط إضافية.' : 
          'The optimal time to run high-load appliances (washing machines, water heaters) is outside peak hours, ideally between <strong>09:00 AM and 01:00 PM</strong> for maximum points rewards.';
      }
      return isAr ? 
        `لقد قمت بتحليل استفسارك بخصوص: "<strong>${escapeHtml(query)}</strong>". أنصحك بمتابعة استهلاك الأجهزة الذكية من صفحة <strong>Apartment & Lamp</strong>، ورصيد نقاطك الحالي <strong>80 نقطة (خصم 8 جنيه)</strong> جاهز للخصم من الفاتورة القادمة.` : 
        `I analyzed your question regarding "<strong>${escapeHtml(query)}</strong>". You can monitor all smart appliances in the <strong>Apartment & Lamp</strong> page. Your current <strong>80 WAFAR Points</strong> give you an active 8.00 EGP discount!`;
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function updateSidebarLampBadge(isOn) {
      const sbBadge = document.getElementById('sidebarLampBadge');
      if (sbBadge) {
        sbBadge.textContent = isOn ? 'ON' : 'OFF';
        sbBadge.className = `nav-badge ${isOn ? 'badge-on' : ''}`;
      }
    }

    document.addEventListener('DOMContentLoaded', async () => {
      // 1. Session Protection Check
      const isAuthed = await AuthAPI.requireAuth();
      if (!isAuthed) return;

      initLiveClock();
      
      const savedTheme = localStorage.getItem('wafar-theme');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }

      // 2. Fetch Initial LED State from Database (public.led_control row id = 1)
      try {
        const initialLedState = await LedAPI.getLedState();
        updateSidebarLampBadge(initialLedState);
      } catch (err) {
        console.warn("Could not fetch initial LED state:", err);
      }

      // 3. Subscribe to Realtime Changes on led_control table
      const ledChannel = LedAPI.subscribeToLedState((isOn) => {
        updateSidebarLampBadge(isOn);
      });

      window.addEventListener('beforeunload', () => {
        LedAPI.unsubscribe(ledChannel);
      });

      const mobileToggle = document.getElementById('mobileToggleBtn');
      const backdrop = document.getElementById('sidebarBackdrop');
      const sidebar = document.getElementById('appSidebar');

      if (mobileToggle && sidebar && backdrop) {
        mobileToggle.addEventListener('click', () => {
          sidebar.classList.toggle('open');
          backdrop.classList.toggle('active');
        });

        backdrop.addEventListener('click', () => {
          sidebar.classList.remove('open');
          backdrop.classList.remove('active');
        });
      }
    });
