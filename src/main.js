// Main Application Orchestrator
import { translations } from './translations.js';
import { renderHeader } from './components/Header.js';
import { renderMediKiosk } from './components/MediKiosk.js';
import { renderSymptomChecker } from './components/SymptomChecker.js';
import { renderScanAnalyzer } from './components/ScanAnalyzer.js';
import { renderChatbot } from './components/Chatbot.js';
import { renderDoctorDashboard } from './components/DoctorDashboard.js';
import { renderAppointmentBooking } from './components/AppointmentBooking.js';
import { renderEmergencyModal } from './components/EmergencyModal.js';
import confetti from 'canvas-confetti';

// State
const state = {
  currentLang: localStorage.getItem('gs_lang') || 'en',
  currentTheme: localStorage.getItem('gs_theme') || 'light',
  currentRole: 'patient', // 'patient' | 'doctor'
  activeTab: 'medikiosk',
  patientQueue: [
    {
      id: "PAT-8012",
      patientName: "Ganesan P. (61M)",
      village: "Thiruvarur South Ward",
      selectedSymptoms: ["Chest Pain / Tightness", "Shortness of Breath"],
      score: 92,
      level: "high",
      spo2: 89,
      sysBp: 178,
      diaBp: 104,
      temperature: 99.1,
      pulse: 112,
      time: "4m ago",
      criticalReasons: ["Severe Hypoxemia (SpO2: 89%)", "Hypertensive Urgency (178/104 mmHg)"],
      resolved: false,
      referred: false
    },
    {
      id: "PAT-8013",
      patientName: "Meenakshi K. (26F)",
      village: "Ulundurpet Ward 3",
      selectedSymptoms: ["Pregnancy Warning Signs", "Severe Headache"],
      score: 84,
      level: "high",
      spo2: 96,
      sysBp: 154,
      diaBp: 98,
      temperature: 98.4,
      pulse: 88,
      time: "12m ago",
      criticalReasons: ["Pre-eclamptic signs in 32nd week of gestation"],
      resolved: false,
      referred: false
    },
    {
      id: "PAT-7984",
      patientName: "Karthik R. (38M)",
      village: "Sankarapuram North",
      selectedSymptoms: ["High Fever", "Persistent Cough"],
      score: 62,
      level: "medium",
      spo2: 94,
      sysBp: 130,
      diaBp: 84,
      temperature: 102.4,
      pulse: 94,
      time: "35m ago",
      criticalReasons: [],
      resolved: false,
      referred: false
    },
    {
      id: "PAT-7921",
      patientName: "Anjali S. (19F)",
      village: "Kallakurichi Block",
      selectedSymptoms: ["Mild Fatigue & Weakness"],
      score: 22,
      level: "low",
      spo2: 99,
      sysBp: 116,
      diaBp: 74,
      temperature: 98.6,
      pulse: 72,
      time: "1h ago",
      criticalReasons: [],
      resolved: true,
      referred: false
    }
  ]
};

// Translation helper
function t(key) {
  const dict = translations[state.currentLang] || translations.en;
  return dict[key] || translations.en[key] || key;
}

// Global Toast Notification
function showToast(type, message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'danger' ? '🚨' : 'ℹ️'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Emergency Modal Handler
function openEmergencyModal() {
  const root = document.getElementById('emergency-modal-root');
  if (!root) return;

  renderEmergencyModal(root, {
    currentLang: state.currentLang,
    t,
    onClose: () => {
      root.innerHTML = '';
    }
  });
}

// Update High-Risk Alert Badge on Navbar
function updateHighRiskBadge() {
  const badge = document.getElementById('high-risk-badge');
  if (badge) {
    const highCount = state.patientQueue.filter(p => p.level === 'high' && !p.resolved).length;
    badge.textContent = `${highCount} Alert`;
    badge.style.display = highCount > 0 ? 'inline-flex' : 'none';
  }
}

// Render Header
function initHeader() {
  const headerContainer = document.getElementById('app-header');
  if (!headerContainer) return;

  renderHeader(headerContainer, {
    currentLang: state.currentLang,
    currentRole: state.currentRole,
    currentTheme: state.currentTheme,
    onLangChange: (newLang) => {
      state.currentLang = newLang;
      localStorage.setItem('gs_lang', newLang);
      refreshApp();
      showToast('info', `Language updated to ${newLang === 'ta' ? 'தமிழ்' : newLang === 'hi' ? 'हिन्दी' : 'English'}`);
    },
    onRoleChange: (newRole) => {
      state.currentRole = newRole;
      if (newRole === 'doctor') {
        switchTab('doctor');
      } else {
        switchTab('medikiosk');
      }
      refreshHeader();
    },
    onThemeToggle: () => {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('gs_theme', state.currentTheme);
      applyTheme();
      refreshHeader();
    },
    onEmergencyClick: () => {
      openEmergencyModal();
    }
  });
}

function refreshHeader() {
  initHeader();
  updateHighRiskBadge();
}

// Apply Theme
function applyTheme() {
  if (state.currentTheme === 'dark') {
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light');
  } else {
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-dark');
  }
}

// Navigation Tabs Switcher
function switchTab(tabId) {
  state.activeTab = tabId;

  // Sync nav tab buttons
  document.querySelectorAll('.nav-tab').forEach(tab => {
    const isTarget = tab.getAttribute('data-tab') === tabId;
    tab.classList.toggle('active', isTarget);
  });

  // Sync pane visibility
  document.querySelectorAll('.tab-pane').forEach(pane => {
    const isTarget = pane.id === `tab-${tabId}`;
    pane.classList.toggle('active', isTarget);
  });

  // Render content of active tab
  renderActiveTab();
}

function renderActiveTab() {
  const tabId = state.activeTab;

  if (tabId === 'medikiosk') {
    const pane = document.getElementById('tab-medikiosk');
    renderMediKiosk(pane, {
      currentLang: state.currentLang,
      t,
      onPushToDoctorQueue: (patientRecord) => {
        state.patientQueue.unshift(patientRecord);
        updateHighRiskBadge();
        showToast('success', `MediKiosk record pushed to Doctor Queue (Token: ${patientRecord.medikioskSummary?.tokenNumber || patientRecord.id})`);
        if (patientRecord.level === 'high') {
          showEmergencyBanner(`Priority Triage: MediKiosk Patient ${patientRecord.patientName} flagged with Acute Red Flag!`);
        }
      },
      onTriggerEmergency: () => {
        openEmergencyModal();
      },
      onShowToast: (type, msg) => {
        showToast(type, msg);
        if (type === 'success') {
          try {
            confetti({
              particleCount: 40,
              spread: 50,
              origin: { y: 0.8 }
            });
          } catch (e) {}
        }
      }
    });
  } else if (tabId === 'symptoms') {
    const pane = document.getElementById('tab-symptoms');
    renderSymptomChecker(pane, {
      currentLang: state.currentLang,
      t,
      onForwardToDoctor: (patientRecord) => {
        state.patientQueue.unshift(patientRecord);
        updateHighRiskBadge();
        showToast('success', `Case forwarded to PHC Medical Officer (ID: ${patientRecord.id})`);
        // If high risk, show top emergency banner
        if (patientRecord.level === 'high') {
          showEmergencyBanner(`High Risk Alert: Patient ${patientRecord.patientName} requires urgent triage!`);
        }
      },
      onTriggerEmergency: () => {
        openEmergencyModal();
      }
    });
  } else if (tabId === 'reports') {
    const pane = document.getElementById('tab-reports');
    renderScanAnalyzer(pane, {
      currentLang: state.currentLang,
      t,
      onForwardToDoctor: (patientRecord) => {
        state.patientQueue.unshift(patientRecord);
        updateHighRiskBadge();
        showToast('success', `Medical scan findings forwarded to Doctor Queue!`);
        if (patientRecord.level === 'high') {
          showEmergencyBanner(`Critical Scan Anomaly queued for immediate doctor review!`);
        }
      },
      onTriggerEmergency: () => {
        openEmergencyModal();
      }
    });
  } else if (tabId === 'chatbot') {
    const pane = document.getElementById('tab-chatbot');
    renderChatbot(pane, {
      currentLang: state.currentLang,
      t,
      onTriggerEmergency: () => {
        openEmergencyModal();
      }
    });
  } else if (tabId === 'appointments') {
    const pane = document.getElementById('tab-appointments');
    renderAppointmentBooking(pane, {
      currentLang: state.currentLang,
      t,
      onShowToast: (type, msg) => {
        showToast(type, msg);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } catch (e) {}
      }
    });
  } else if (tabId === 'doctor') {
    const pane = document.getElementById('tab-doctor');
    renderDoctorDashboard(pane, {
      currentLang: state.currentLang,
      t,
      patientQueue: state.patientQueue,
      onUpdateQueue: (updatedQueue) => {
        state.patientQueue = updatedQueue;
        updateHighRiskBadge();
        showToast('info', 'Doctor queue records updated.');
      },
      onTriggerEmergency: () => {
        openEmergencyModal();
      }
    });
  }
}

// Emergency Banner Logic
function showEmergencyBanner(msg) {
  const banner = document.getElementById('emergency-banner');
  const textEl = document.getElementById('emergency-banner-text');
  if (banner && textEl) {
    textEl.textContent = msg;
    banner.classList.remove('hidden');
  }
}

function setupEmergencyBanner() {
  const banner = document.getElementById('emergency-banner');
  const callBtn = document.getElementById('banner-call-108-btn');
  const phcBtn = document.getElementById('banner-view-phc-btn');
  const dismissBtn = document.getElementById('banner-dismiss-btn');

  if (callBtn) {
    callBtn.addEventListener('click', () => {
      window.location.href = "tel:108";
    });
  }

  if (phcBtn) {
    phcBtn.addEventListener('click', () => {
      openEmergencyModal();
    });
  }

  if (dismissBtn && banner) {
    dismissBtn.addEventListener('click', () => {
      banner.classList.add('hidden');
    });
  }
}

// Setup Nav Tabs
function setupNav() {
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      switchTab(tabId);
    });
  });
}

// Refresh entire UI on language switch
function refreshApp() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  refreshHeader();
  switchTab(state.activeTab);
}

// Initialize Application
function init() {
  applyTheme();
  initHeader();
  setupNav();
  setupEmergencyBanner();
  updateHighRiskBadge();
  switchTab(state.activeTab);
}

document.addEventListener('DOMContentLoaded', init);
