/**
 * WAFAR AI Assistant Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  setupChat();

  window.addEventListener('wafar:langchange', () => {
    updateWelcomeBubble();
  });
});

function setupChat() {
  const input = document.getElementById('userMessageInput');
  if (input) input.focus();
  updateWelcomeBubble();
}

function updateWelcomeBubble() {
  const welcome = document.getElementById('assistantWelcomeBubble');
  if (!welcome) return;
  const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
  welcome.innerHTML = isAr ? 
    "أهلاً بك عبدالله! أنا <strong>مساعد وفّر الذكي</strong> لمراقبة وترشيد الطاقة. اسألني عن استهلاكك، نصائح التوفير، أو حالة المصباح الذكي." : 
    "Hello Abdalla! I am your <strong>WAFAR AI Energy Assistant</strong>. Ask me anything about your power usage, saving tips, or your smart lamp.";
}

async function handleChatSubmit(event) {
  event.preventDefault();
  const input = document.getElementById('userMessageInput');
  const query = input.value.trim();
  if (!query) return;

  input.value = '';
  await processUserMessage(query);
}

async function handlePromptChipClick(promptText) {
  if (!promptText) return;
  await processUserMessage(promptText);
}

async function processUserMessage(text) {
  const container = document.getElementById('chatMessagesContainer');
  if (!container) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // User message
  const userHtml = `
    <div class="message-bubble-row user">
      <div class="message-avatar">AM</div>
      <div style="display: flex; flex-direction: column; align-items: flex-end;">
        <div class="message-content">
          ${escapeHtml(text)}
        </div>
        <span class="message-time">${timeStr}</span>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', userHtml);
  scrollToBottom();

  // Typing indicator
  const typingId = `typing-${Date.now()}`;
  const typingHtml = `
    <div class="message-bubble-row assistant" id="${typingId}">
      <div class="message-avatar">⚡</div>
      <div class="message-content" style="padding: 10px 16px;">
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', typingHtml);
  scrollToBottom();

  const response = await AssistantAPI.processPrompt(text);

  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    let metricsHtml = '';
    if (response.metrics && response.metrics.length > 0) {
      metricsHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin-top: 10px;">
          ${response.metrics.map(m => `
            <div style="background: var(--bg-app); border: 1px solid var(--border); padding: 6px 8px; border-radius: var(--radius-xs);">
              <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${m.label}</div>
              <div style="font-size: 0.88rem; font-weight: 800; color: var(--text-primary);">${m.value}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    let actionHtml = '';
    if (response.action) {
      actionHtml = `
        <div style="margin-top: 10px;">
          <a href="${response.action.link}" class="btn btn-sm btn-primary" style="font-size: 0.76rem;">
            ${response.action.label} &rarr;
          </a>
        </div>
      `;
    }

    const formattedAnswer = formatMarkdownText(response.answer);

    const assistantHtml = `
      <div class="message-bubble-row assistant">
        <div class="message-avatar">⚡</div>
        <div style="display: flex; flex-direction: column;">
          <div class="message-content">
            ${formattedAnswer}
            ${metricsHtml}
            ${actionHtml}
          </div>
          <span class="message-time">${timeStr}</span>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('beforeend', assistantHtml);
    scrollToBottom();
  }, 500);
}

function scrollToBottom() {
  const container = document.getElementById('chatMessagesContainer');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function resetChatHistory() {
  const container = document.getElementById('chatMessagesContainer');
  if (container) {
    container.innerHTML = `
      <div class="message-bubble-row assistant">
        <div class="message-avatar">⚡</div>
        <div style="display: flex; flex-direction: column;">
          <div class="message-content" id="assistantWelcomeBubble">
            ${typeof i18n !== 'undefined' && i18n.isRtl() ? 
              'تم مسح المحادثة. أنا جاهز لإجابة أي سؤال حول استهلاكك!' : 
              'Thread cleared. Ready for your smart energy questions!'}
          </div>
          <span class="message-time">Just now</span>
        </div>
      </div>
    `;
    WafarUI.showToast(typeof i18n !== 'undefined' && i18n.isRtl() ? "تم مسح المحادثة" : "Thread cleared", "info");
  }
}

function formatMarkdownText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n- /g, '<br>• ');
}

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
