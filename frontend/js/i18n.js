/**
 * WAFAR Internationalization & Translation Engine (Natural Egyptian Arabic & English)
 */

const translations = {
  en: {
    // Brand
    brand_name: "WAFAR",
    grid_status: "Grid Status",
    user_name: "Abdalla M.",
    user_location: "Apartment #4",

    // Navigation
    nav_main: "Main Menu",
    nav_dashboard: "Dashboard",
    nav_devices: "Apartment & Lamp",
    nav_energy: "Energy",
    nav_points: "WAFAR Points",
    nav_billing: "Billing",
    nav_assistant: "AI Assistant",
    nav_logout: "Sign Out",

    // Units & Common
    unit_w: "Watts",
    unit_kwh: "kWh",
    currency: "EGP",
    btn_save: "Save",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    status_on: "ON",
    status_off: "OFF",

    // Login Page
    login_welcome: "Welcome to WAFAR",
    login_subtitle: "Smart energy monitoring and bill savings for your home",
    login_tab_signin: "Sign In",
    login_tab_signup: "Create Account",
    login_email: "Email Address",
    login_password: "Password",
    login_forgot: "Forgot Password?",
    login_remember: "Remember me",
    login_demo: "Demo Mode",
    login_btn: "Sign In to Dashboard",
    login_authenticating: "Signing in...",
    login_footer: "Protected by WAFAR Energy Shield",
    login_hero_title: "Monitor power. Save energy. Get discounts on your bill.",
    login_feat1_title: "Live Consumption",
    login_feat1_desc: "Real-time tracking of your home electricity usage.",
    login_feat2_title: "Direct Bill Discounts",
    login_feat2_desc: "Every 10 WAFAR points give you 1 EGP direct bill discount.",
    login_feat3_title: "Smart Lamp Control",
    login_feat3_desc: "Control your bedroom lamp and avoid peak tariff hours.",

    // Dashboard Page
    dash_title: "Dashboard",
    dash_subtitle: "Your daily electricity consumption, smart lamp, and bill discount.",
    kpi_today_usage: "Today's Consumption",
    kpi_avg_usage: "Average Daily",
    kpi_saved_today: "Saved Today",
    kpi_current_bill: "Current Bill",
    kpi_wafar_discount: "WAFAR Discount",
    kpi_points_balance: "WAFAR Points",
    kpi_points_value: "Bill Discount",
    kpi_lamp_status: "Bedroom Lamp",
    chart_today_title: "Today's Hourly Usage",
    chart_today_sub: "Real-time consumption in kWh vs baseline",
    chart_actual_label: "Actual (kWh)",
    chart_target_label: "Average",
    recent_activity_title: "Recent Activity",

    // Devices / Apartment Floor Plan Page
    floorplan_title: "Apartment Layout",
    floorplan_subtitle: "Interactive house floor plan and connected smart hardware.",
    room_bedroom: "Bedroom",
    room_living: "Living Room",
    room_kitchen: "Kitchen",
    room_bathroom: "Bathroom",
    device_smart_lamp: "Bedroom Smart Lamp",
    lamp_running_time: "Running",
    lamp_draw_label: "Power Draw",
    lamp_btn_turn_off: "Turn Off",
    lamp_btn_turn_on: "Turn On",
    room_no_device: "No smart devices connected yet",
    floorplan_note: "Hardware concept: The bedroom lamp communicates directly with the ESP32 micro-controller.",

    // Energy Page
    energy_title: "Energy Analytics",
    energy_subtitle: "Historical usage patterns and daily consumption history.",
    filter_day: "Today",
    filter_week: "This Week",
    filter_month: "This Month",
    energy_total_kwh: "Total Usage",
    energy_total_cost: "Est. Energy Cost",
    energy_log_title: "Daily Usage Breakdown",
    th_day: "Day",
    th_usage: "Consumption",
    th_avg: "Average",
    th_diff: "Saved",
    th_cost: "Cost (EGP)",

    // Points Page (Discount Only)
    points_title: "WAFAR Points",
    points_subtitle: "Save electricity to earn WAFAR Points and reduce your monthly bill.",
    points_rule_banner: "10 WAFAR Points = 1 EGP Discount",
    points_curr_balance: "Current Points",
    points_discount_val: "Available Bill Discount",
    points_next_egp_note: "points to your next 1 EGP discount",
    points_history_title: "Points Earning Log",

    // Billing Page
    billing_title: "Billing & Payments",
    billing_subtitle: "Electricity bill summary with applied WAFAR points discount.",
    bill_original_amount: "Electricity Bill",
    bill_discount_applied: "WAFAR Points Discount (80 pts)",
    bill_net_to_pay: "Amount to Pay",
    bill_due_date: "Due Date: Sep 10, 2026",
    bill_status_due: "Due Soon",
    bill_status_paid: "Paid",
    btn_pay_bill: "Pay Bill Now",
    select_payment_method: "Select Payment Method",
    method_vodafone: "Vodafone Cash",
    method_instapay: "InstaPay",
    method_card: "Debit / Credit Card",
    invoices_history_title: "Previous Invoices",
    th_invoice_num: "Invoice",
    th_month: "Month",
    th_kwh: "Usage",
    th_net_amount: "Paid Amount",
    th_status: "Status",

    // Assistant Page
    assistant_title: "AI Energy Assistant",
    assistant_subtitle: "Ask WAFAR about your electricity consumption and savings.",
    assistant_status: "Online & Monitoring",
    sug_1: "How much energy did I use today?",
    sug_2: "Is my bedroom lamp ON?",
    sug_3: "How much discount do my points give me?",
    sug_4: "How can I reduce my electricity bill?",
    input_placeholder: "Ask WAFAR about your home energy, bill, or lamp...",
    btn_send: "Send",
    btn_clear: "Clear"
  },

  ar: {
    // Brand
    brand_name: "وفّر",
    grid_status: "حالة الشبكة",
    user_name: "عبدالله م.",
    user_location: "شقة #4",

    // Navigation
    nav_main: "القائمة الرئيسية",
    nav_dashboard: "الرئيسية",
    nav_devices: "الشقة والمصباح",
    nav_energy: "استهلاك الطاقة",
    nav_points: "نقاط وفّر",
    nav_billing: "الفواتير والدفع",
    nav_assistant: "المساعد الذكي",
    nav_logout: "تسجيل الخروج",

    // Units & Common
    unit_w: "واط",
    unit_kwh: "ك.واط/س",
    currency: "جنيه",
    btn_save: "حفظ",
    btn_cancel: "إلغاء",
    btn_confirm: "تأكيد",
    status_on: "يعمل",
    status_off: "مُغلق",

    // Login Page
    login_welcome: "مرحباً بك في وفّر",
    login_subtitle: "راقب استهلاك الكهرباء في بيتك ووفّر في فاتورتك",
    login_tab_signin: "تسجيل الدخول",
    login_tab_signup: "حساب جديد",
    login_email: "البريد الإلكتروني",
    login_password: "كلمة المرور",
    login_forgot: "نسيت كلمة المرور؟",
    login_remember: "تذكرني",
    login_demo: "نسخة تجريبية",
    login_btn: "الدخول للوحة التحكم",
    login_authenticating: "جاري الدخول...",
    login_footer: "محمي بنظام وفّر لترشيد الطاقة",
    login_hero_title: "راقب استهلاكك. وفّر في الكهرباء. واخفض فاتورتك.",
    login_feat1_title: "متابعة مباشرة",
    login_feat1_desc: "معرفة استهلاك شقتك من الكهرباء لحظة بلحظة.",
    login_feat2_title: "خصم مباشر عالفاتورة",
    login_feat2_desc: "كل 10 نقاط وفّر تخصم لك 1 جنيه من فاتورة الكهرباء.",
    login_feat3_title: "تحكم بمصباح أوضة النوم",
    login_feat3_desc: "شغّل واقفل المصباح ووفّر في ساعات الذروة.",

    // Dashboard Page
    dash_title: "لوحة التحكم",
    dash_subtitle: "استهلاكك النهارده، حالة مصباح أوضة النوم، وخصم فاتورتك.",
    kpi_today_usage: "استهلاكك النهارده",
    kpi_avg_usage: "المعدل اليومي",
    kpi_saved_today: "وفرت النهارده",
    kpi_current_bill: "فاتورتك الحالية",
    kpi_wafar_discount: "خصمك من وفّر",
    kpi_points_balance: "نقاط وفّر",
    kpi_points_value: "خصم الفاتورة",
    kpi_lamp_status: "مصباح أوضة النوم",
    chart_today_title: "استهلاك الطاقة على مدار اليوم",
    chart_today_sub: "استهلاكك بالساعات مقابل المعدل الطبيعي",
    chart_actual_label: "الاستهلاك الفعلي",
    chart_target_label: "المعدل الطبيعي",
    recent_activity_title: "آخر أنشطة الطاقة",

    // Devices / Apartment Floor Plan Page
    floorplan_title: "مخطط الشقة",
    floorplan_subtitle: "توزيع غرف الشقة وأجهزة وفّر الذكية المتصلة.",
    room_bedroom: "أوضة النوم",
    room_living: "الريسبشن",
    room_kitchen: "المطبخ",
    room_bathroom: "الحمام",
    device_smart_lamp: "مصباح أوضة النوم الذكي",
    lamp_running_time: "شغّال من",
    lamp_draw_label: "القدرة الحالية",
    lamp_btn_turn_off: "اقفل اللمبة",
    lamp_btn_turn_on: "شغّل اللمبة",
    room_no_device: "لا توجد أجهزة متصلة هنا حالياً",
    floorplan_note: "فكرة الجهاز: مصباح أوضة النوم يتصل مباشرة بمتحكم ESP32 الذكي.",

    // Energy Page
    energy_title: "تحليلات الطاقة",
    energy_subtitle: "تفاصيل استهلاكك اليومي والأسبوعي والشهري.",
    filter_day: "النهارده",
    filter_week: "الأسبوع ده",
    filter_month: "الشهر ده",
    energy_total_kwh: "إجمالي الاستهلاك",
    energy_total_cost: "تكلفة الكهرباء",
    energy_log_title: "سجل الاستهلاك اليومي",
    th_day: "اليوم",
    th_usage: "الاستهلاك",
    th_avg: "المعدل",
    th_diff: "وفرت",
    th_cost: "التكلفة (جنيه)",

    // Points Page (Discount Only)
    points_title: "نقاط وفّر",
    points_subtitle: "كل ما ترشّد في الكهرباء بتجمع نقاط تخصمها مباشرة من الفاتورة.",
    points_rule_banner: "10 نقاط وفّر = 1 جنيه خصم عالفاتورة",
    points_curr_balance: "رصيد نقاطك",
    points_discount_val: "الخصم المتاح عالفاتورة",
    points_next_egp_note: "نقاط متبقية لـ 1 جنيه خصم إضافي",
    points_history_title: "سجل تجميع النقاط",

    // Billing Page
    billing_title: "الفاتورة والدفع",
    billing_subtitle: "تفاصيل فاتورة الكهرباء مع خصم نقاط وفّر المباشر.",
    bill_original_amount: "قيمة الفاتورة",
    bill_discount_applied: "خصم نقاط وفّر (80 نقطة)",
    bill_net_to_pay: "المطلوب دفعه",
    bill_due_date: "مستحقة في: 10 سبتمبر 2026",
    bill_status_due: "مستحقة قريباً",
    bill_status_paid: "تم الدفع",
    btn_pay_bill: "ادفع الفاتورة الآن",
    select_payment_method: "اختر وسيلة الدفع",
    method_vodafone: "فودافون كاش",
    method_instapay: "إنستاباي (InstaPay)",
    method_card: "كارت بنكي (فيزا / ماستركارد)",
    invoices_history_title: "الفواتير السابقة",
    th_invoice_num: "رقم الفاتورة",
    th_month: "الشهر",
    th_kwh: "الاستهلاك",
    th_net_amount: "المبلغ المدفوع",
    th_status: "الحالة",

    // Assistant Page
    assistant_title: "مساعد وفّر الذكي",
    assistant_subtitle: "اسأل وفّر عن استهلاكك وفاتورتك وطرق التوفير.",
    assistant_status: "متصل ويراقب الاستهلاك",
    sug_1: "استهلكت كام كهرباء النهارده؟",
    sug_2: "لمبة أوضة النوم شغّالة؟",
    sug_3: "نقاط وفّر تديني خصم كام جنيه؟",
    sug_4: "ازاي أقلل فاتورة الكهرباء الشهر ده؟",
    input_placeholder: "اسأل وفّر عن استهلاكك، اللمبة، أو خصم الفاتورة...",
    btn_send: "إرسال",
    btn_clear: "مسح"
  }
};

const i18n = {
  currentLang: localStorage.getItem('wafar_lang') || 'en',

  init: function () {
    this.setLanguage(this.currentLang);
  },

  setLanguage: function (lang) {
    if (!translations[lang]) lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('wafar_lang', lang);

    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    this.translateDOM();

    const langBtn = document.getElementById('langSwitchBtn');
    if (langBtn) {
      langBtn.textContent = isRtl ? 'EN' : 'عربي';
      langBtn.title = isRtl ? 'Switch to English' : 'التحويل للغة العربية';
    }

    window.dispatchEvent(new CustomEvent('wafar:langchange', { detail: { lang, isRtl } }));
  },

  toggleLanguage: function () {
    const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.setLanguage(nextLang);
  },

  t: function (key) {
    return translations[this.currentLang][key] || translations['en'][key] || key;
  },

  getLang: function () {
    return this.currentLang;
  },

  isRtl: function () {
    return this.currentLang === 'ar';
  },

  translateDOM: function () {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
