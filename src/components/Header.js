// Header Component
import { translations } from '../translations.js';

export function renderHeader(container, { currentLang, currentRole, currentTheme, onLangChange, onRoleChange, onThemeToggle, onEmergencyClick }) {
  const isDark = currentTheme === 'dark';
  const dict = translations[currentLang] || translations.en;

  const appTitle = currentLang === 'ta' ? 'கிராமின் நல்வாழ்வு' : currentLang === 'hi' ? 'ग्रामीण स्वास्थ्य' : 'GraminSwasthya';
  const appSubtitle = dict.app_subtitle || "Rural Healthcare & Early Risk Detection";
  const rolePatient = dict.role_patient || "Patient / ASHA";
  const roleDoctor = dict.role_doctor || "Doctor View";
  const emergText = dict.emergency_call_btn || "🚨 Emergency 108";

  container.innerHTML = `
    <div class="header-container">
      <div class="brand-section">
        <div class="brand-logo-badge" title="GraminSwasthya AI Platform">
          <span>🩺</span>
        </div>
        <div class="brand-titles">
          <h1>${appTitle} <span>AI</span></h1>
          <div class="brand-subtitle" id="header-subtitle">${appSubtitle}</div>
        </div>
      </div>

      <div class="header-controls">
        <!-- Language Switcher -->
        <div class="language-selector" aria-label="Select Language">
          <button class="lang-btn ${currentLang === 'en' ? 'active' : ''}" data-lang="en">English</button>
          <button class="lang-btn ${currentLang === 'ta' ? 'active' : ''}" data-lang="ta">தமிழ்</button>
          <button class="lang-btn ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi">हिन्दी</button>
        </div>

        <!-- Role Toggle (Patient / ASHA vs Doctor Portal) -->
        <div class="role-toggle" aria-label="User View Mode">
          <button class="role-btn ${currentRole === 'patient' ? 'active' : ''}" data-role="patient">
            <span>👩‍⚕️</span>
            <span class="role-label" id="label-role-patient">${rolePatient}</span>
          </button>
          <button class="role-btn ${currentRole === 'doctor' ? 'active' : ''}" data-role="doctor">
            <span>👨‍⚕️</span>
            <span class="role-label" id="label-role-doctor">${roleDoctor}</span>
          </button>
        </div>

        <!-- Theme Toggle -->
        <button class="icon-btn" id="theme-toggle-btn" title="Toggle Light/Dark Theme" aria-label="Toggle Theme">
          ${isDark ? '☀️' : '🌙'}
        </button>

        <!-- Fast Emergency Hotline Button -->
        <button class="btn-emergency-top" id="top-emergency-btn" title="Immediate 108 Emergency Dial">
          <span id="label-emergency-btn">${emergText}</span>
        </button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.target.getAttribute('data-lang');
      onLangChange(lang);
    });
  });

  container.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const role = e.currentTarget.getAttribute('data-role');
      onRoleChange(role);
    });
  });

  const themeBtn = container.querySelector('#theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', onThemeToggle);
  }

  const emergBtn = container.querySelector('#top-emergency-btn');
  if (emergBtn) {
    emergBtn.addEventListener('click', onEmergencyClick);
  }
}
