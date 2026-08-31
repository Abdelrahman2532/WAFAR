/**
 * WAFAR API & Data Layer (Frontend Mock / Future Backend Contracts)
 *
 * NOTE: WAFAR Demo Hardware is ONE SMART LAMP located in the Bedroom.
 * Future ESP32 Local Endpoints:
 * - ON:  http://192.168.1.100/on
 * - OFF: http://192.168.1.100/off
 */

const WafarData = {
  // Bedroom Smart Lamp (Single connected device in the house)
  smartLamp: {
    id: "dev-bedroom-lamp-01",
    name: "Bedroom Smart Lamp",
    name_ar: "مصباح أوضة النوم الذكي",
    room: "Bedroom",
    room_ar: "أوضة النوم",
    state: true,
    powerWatts: 15,
    runningTimeFormatted: "2h 34m",
    dailyKWh: 0.038,
    espEndpointOn: "http://192.168.1.100/on",
    espEndpointOff: "http://192.168.1.100/off"
  },

  // WAFAR Points (Only purpose: Discount on electricity bill. 10 Points = 1 EGP)
  pointsProfile: {
    totalPoints: 80,
    pointsPerEGP: 10,
    discountEGP: 8.00,
    pointsNeededForNextEGP: 0 // already exact multiple of 10, next EGP needs 10 pts
  },

  // Billing Mock Data in Egyptian Pounds (EGP)
  billing: {
    currentBill: {
      originalAmountEGP: 342.50,
      wafarDiscountEGP: 8.00, // 80 points = 8 EGP
      netAmountEGP: 334.50,
      dueDate: "Sep 10, 2026",
      status: "unpaid",
      period: "August 2026",
      kwhUsed: 215.4
    },
    invoices: [
      { id: "INV-EGY-08", month: "Aug 2026", kwh: 215.4, amountEGP: 334.50, discountEGP: 8.00, isPaid: false },
      { id: "INV-EGY-07", month: "Jul 2026", kwh: 248.0, amountEGP: 375.00, discountEGP: 12.00, isPaid: true },
      { id: "INV-EGY-06", month: "Jun 2026", kwh: 260.5, amountEGP: 395.20, discountEGP: 15.00, isPaid: true }
    ]
  },

  // Points Earning History
  pointsHistory: [
    { id: "p1", date: "Today", action: "Bedroom lamp turned off during daylight", points: "+10 pts", egpValue: "1 EGP" },
    { id: "p2", date: "Yesterday", action: "Electricity consumption lower than average", points: "+20 pts", egpValue: "2 EGP" },
    { id: "p3", date: "Aug 26", action: "Peak hours energy saving", points: "+10 pts", egpValue: "1 EGP" }
  ]
};

// ==========================================================================
// API SERVICE MODULES
// ==========================================================================

const DevicesAPI = {
  getLampState: async () => {
    return { ...WafarData.smartLamp };
  },

  toggleLamp: async (newState) => {
    WafarData.smartLamp.state = newState;
    WafarData.smartLamp.powerWatts = newState ? 15 : 0;
    
    // Future ESP32 local HTTP call will connect here:
    // const endpoint = newState ? WafarData.smartLamp.espEndpointOn : WafarData.smartLamp.espEndpointOff;
    // await fetch(endpoint);

    return { success: true, lamp: { ...WafarData.smartLamp } };
  }
};

const PointsAPI = {
  getPointsSummary: async () => {
    const pts = WafarData.pointsProfile.totalPoints;
    const discount = Math.floor(pts / WafarData.pointsProfile.pointsPerEGP);
    const remainder = pts % WafarData.pointsProfile.pointsPerEGP;
    const needed = remainder === 0 ? 10 : 10 - remainder;

    return {
      points: pts,
      discountEGP: discount,
      neededForNextEGP: needed,
      history: [...WafarData.pointsHistory]
    };
  }
};

const BillingAPI = {
  getBillingSummary: async () => {
    const pts = WafarData.pointsProfile.totalPoints;
    const discountEGP = Math.floor(pts / 10);
    const original = WafarData.billing.currentBill.originalAmountEGP;
    const net = original - discountEGP;

    WafarData.billing.currentBill.wafarDiscountEGP = discountEGP;
    WafarData.billing.currentBill.netAmountEGP = net;

    return { ...WafarData.billing };
  },

  payBill: async (method) => {
    WafarData.billing.currentBill.status = "paid";
    const currentInv = WafarData.billing.invoices.find(i => !i.isPaid);
    if (currentInv) {
      currentInv.isPaid = true;
    }
    return {
      success: true,
      amount: WafarData.billing.currentBill.netAmountEGP,
      method: method
    };
  }
};

const DashboardAPI = {
  getSummaryMetrics: async () => {
    const pts = WafarData.pointsProfile.totalPoints;
    const discountEGP = Math.floor(pts / 10);
    const bill = WafarData.billing.currentBill;

    return {
      todayKWh: 11.90,
      avgDailyKWh: 12.49,
      savedKWh: 0.59,
      lampState: WafarData.smartLamp.state,
      lampWatts: WafarData.smartLamp.powerWatts,
      lampRoom: WafarData.smartLamp.room,
      lampRoomAr: WafarData.smartLamp.room_ar,
      billAmountEGP: bill.originalAmountEGP,
      discountEGP: discountEGP,
      netToPayEGP: bill.originalAmountEGP - discountEGP,
      points: pts
    };
  },

  getHourlyUsage: async () => {
    return [
      { hour: "00:00", kwh: 0.4, baseline: 0.5 },
      { hour: "04:00", kwh: 0.3, baseline: 0.4 },
      { hour: "08:00", kwh: 0.8, baseline: 1.0 },
      { hour: "12:00", kwh: 1.4, baseline: 1.6 },
      { hour: "16:00", kwh: 1.8, baseline: 2.1 },
      { hour: "19:00", kwh: 2.2, baseline: 2.4 },
      { hour: "22:00", kwh: 1.1, baseline: 1.3 }
    ];
  },

  getRecentActivity: async () => {
    const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
    return [
      { time: "20:14", event: isAr ? "تم تشغيل مصباح أوضة النوم (15 واط)" : "Bedroom smart lamp turned ON (15W)" },
      { time: "18:00", event: isAr ? "استهلاكك أقل من المعدل بنسبة 5%" : "Consumption is 5% below average" },
      { time: "14:00", event: isAr ? "كسبت 10 نقاط وفّر لترشيد الاستهلاك" : "Earned +10 WAFAR points for energy saving" }
    ];
  }
};

const EnergyAPI = {
  getAnalytics: async () => {
    return {
      todayKWh: 11.90,
      avgDailyKWh: 12.49,
      savedKWh: 0.59,
      monthTotalKWh: 215.4,
      monthCostEGP: 342.50,
      dailyComparison: [
        { label: "Mon", current: 11.8, previous: 12.5 },
        { label: "Tue", current: 11.4, previous: 12.3 },
        { label: "Wed", current: 12.1, previous: 12.8 },
        { label: "Thu", current: 11.9, previous: 12.6 },
        { label: "Fri", current: 12.8, previous: 13.4 },
        { label: "Sat", current: 13.0, previous: 13.5 },
        { label: "Sun", current: 11.2, previous: 12.0 }
      ]
    };
  }
};

const AssistantAPI = {
  processPrompt: async (query) => {
    const isAr = typeof i18n !== 'undefined' && i18n.isRtl();
    const lower = query.toLowerCase();

    if (lower.includes("today") || lower.includes("النهارده") || lower.includes("استهلكت")) {
      return {
        answer: isAr ? 
          "استهلاكك النهارده **11.90 ك.واط/س**، وهو أقل من معدلك الطبيعي (12.49 ك.واط/س). يعني وفرت **0.59 ك.واط/س** النهارده! 👏" : 
          "Today's consumption is **11.90 kWh**, which is below your daily average (12.49 kWh). You saved **0.59 kWh** today!",
        metrics: [
          { label: isAr ? "استهلاك النهارده" : "Today", value: "11.90 kWh" },
          { label: isAr ? "المعدل الطبيعي" : "Average", value: "12.49 kWh" },
          { label: isAr ? "وفرت" : "Saved", value: "-0.59 kWh" }
        ],
        action: { label: isAr ? "عرض تحليلات الطاقة" : "View Energy Analytics", link: "../energy/index.html" }
      };
    }

    if (lower.includes("lamp") || lower.includes("لمبة") || lower.includes("مصباح") || lower.includes("نوم")) {
      const lamp = WafarData.smartLamp;
      return {
        answer: isAr ? 
          `مصباح أوضة النوم حالياً **${lamp.state ? 'شغّال' : 'مقفول'}** بسحب قدرة **${lamp.powerWatts} واط**. مدة التشغيل اليوم: **${lamp.runningTimeFormatted}**.` : 
          `The Bedroom Smart Lamp is currently **${lamp.state ? 'ON' : 'OFF'}** drawing **${lamp.powerWatts} Watts**. Running time today: **${lamp.runningTimeFormatted}**.`,
        metrics: [
          { label: isAr ? "الحالة" : "State", value: lamp.state ? (isAr ? "شغّال (15 واط)" : "ON (15W)") : (isAr ? "مُغلق" : "OFF") },
          { label: isAr ? "المكان" : "Room", value: isAr ? "أوضة النوم" : "Bedroom" }
        ],
        action: { label: isAr ? "مخطط الشقة واللمبة" : "Apartment Floor Plan", link: "../devices/index.html" }
      };
    }

    if (lower.includes("points") || lower.includes("نقاط") || lower.includes("خصم") || lower.includes("discount")) {
      return {
        answer: isAr ? 
          "معاك حالياً **80 نقطة وفّر** تديك **8 جنيه خصم مباشر** على فاتورة الكهرباء الحالية (كل 10 نقاط = 1 جنيه خصم)." : 
          "You currently have **80 WAFAR Points**, giving you an **8 EGP direct discount** on your electricity bill (10 points = 1 EGP discount).",
        metrics: [
          { label: isAr ? "نقاط وفّر" : "Points", value: "80 pts" },
          { label: isAr ? "قيمة الخصم" : "Discount", value: "8.00 EGP" }
        ],
        action: { label: isAr ? "عرض صفحة النقاط" : "View Points Page", link: "../points/index.html" }
      };
    }

    if (lower.includes("bill") || lower.includes("فاتورة") || lower.includes("ادفع") || lower.includes("سداد")) {
      return {
        answer: isAr ? 
          "فاتورتك الحالية **342.50 جنيه**، بعد تطبيق خصم وفّر (**-8.00 جنيه**) يصبح المبلغ المطلوب دفعه **334.50 جنيه**. تقدر تدفعها بفودافون كاش أو إنستاباي أو كارتك." : 
          "Your current bill is **342.50 EGP**. With your WAFAR discount (**-8.00 EGP**), the amount to pay is **334.50 EGP**. You can pay via Vodafone Cash, InstaPay, or Card.",
        metrics: [
          { label: isAr ? "الفاتورة" : "Bill", value: "342.50 EGP" },
          { label: isAr ? "خصم وفّر" : "Discount", value: "-8.00 EGP" },
          { label: isAr ? "المطلوب دفعه" : "To Pay", value: "334.50 EGP" }
        ],
        action: { label: isAr ? "الانتقال لصفحة الفواتير" : "Go to Billing", link: "../billing/index.html" }
      };
    }

    // Default response
    return {
      answer: isAr ? 
        "أنا هنا لمساعدتك في مراقبة استهلاك بيتك وتوفير فاتورة الكهرباء. اسألني عن استهلاكك، اللمبة، أو خصم نقاط وفّر." : 
        "I'm here to help you monitor and save on your electricity. Ask me about today's usage, bedroom lamp, or your WAFAR discount.",
      metrics: [
        { label: isAr ? "استهلاك النهارده" : "Today", value: "11.90 kWh" },
        { label: isAr ? "خصمك متاح" : "Discount", value: "8 EGP" }
      ],
      action: { label: isAr ? "الرئيسية" : "Dashboard", link: "../dashboard/index.html" }
    };
  }
};
