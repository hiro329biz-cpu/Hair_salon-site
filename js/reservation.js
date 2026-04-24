/* ============================================
   Reservation Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reservationForm');
  const successScreen = document.getElementById('successScreen');
  if (!form) return;

  const steps = form.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  let currentStep = 1;
  let selectedTime = '';

  // Menu labels for summary
  const menuLabels = {
    'design-cut': 'デザインカット',
    'mens-cut': 'メンズカット',
    'one-make-color': 'ワンメイクカラー',
    'illumina-color': 'イルミナカラー',
    'highlight': 'ハイライト',
    'digital-perm': 'デジタルパーマ',
    'premium-treatment': 'プレミアムトリートメント',
    'head-spa': 'ヘッドスパ',
    'straightening': '縮毛矯正',
    'hair-set': 'ヘアセット'
  };

  const staffLabels = {
    'omakase': 'おまかせ',
    'tanaka': '田中 優花',
    'sato': '佐藤 健太',
    'suzuki': '鈴木 麻里',
    'hashimoto': '橋本 愛',
    'nakamura': '中村 りこ'
  };

  // --- Navigate Steps ---
  function goToStep(step) {
    currentStep = step;

    steps.forEach(s => s.classList.remove('active'));
    const target = form.querySelector(`.form-step[data-step="${step}"]`);
    if (target) target.classList.add('active');

    progressSteps.forEach(ps => {
      const psStep = parseInt(ps.dataset.step);
      ps.classList.remove('active', 'completed');
      if (psStep === step) ps.classList.add('active');
      else if (psStep < step) ps.classList.add('completed');
    });

    // Update summary on step 4
    if (step === 4) updateSummary();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Validation ---
  function showError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('visible');
  }

  function hideError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('visible');
  }

  function validateStep1() {
    const checked = form.querySelectorAll('input[name="menu"]:checked');
    if (checked.length === 0) {
      showError('menuError');
      return false;
    }
    hideError('menuError');
    return true;
  }

  function validateStep2() {
    let valid = true;
    const date = document.getElementById('date');
    if (!date.value) {
      showError('dateError');
      date.classList.add('error');
      valid = false;
    } else {
      hideError('dateError');
      date.classList.remove('error');
    }

    if (!selectedTime) {
      showError('timeError');
      valid = false;
    } else {
      hideError('timeError');
    }

    return valid;
  }

  function validateStep4() {
    let valid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');

    if (!name.value.trim()) {
      showError('nameError');
      name.classList.add('error');
      valid = false;
    } else {
      hideError('nameError');
      name.classList.remove('error');
    }

    if (!phone.value.trim()) {
      showError('phoneError');
      phone.classList.add('error');
      valid = false;
    } else {
      hideError('phoneError');
      phone.classList.remove('error');
    }

    return valid;
  }

  // --- Time Slots ---
  const timeGrid = document.getElementById('timeGrid');
  if (timeGrid) {
    timeGrid.addEventListener('click', (e) => {
      const slot = e.target.closest('.time-slot');
      if (!slot) return;

      timeGrid.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.dataset.time;
      hideError('timeError');
    });
  }

  // --- Clear errors on focus ---
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.form-error');
      if (errorEl) errorEl.classList.remove('visible');
    });
  });

  // --- Update Summary ---
  function updateSummary() {
    const checked = form.querySelectorAll('input[name="menu"]:checked');
    const menuNames = Array.from(checked).map(c => menuLabels[c.value] || c.value);
    document.getElementById('summaryMenu').textContent = menuNames.join(', ') || '-';

    const date = document.getElementById('date').value;
    const dateStr = date ? new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
    document.getElementById('summaryDate').textContent = `${dateStr} ${selectedTime || ''}`;

    const staff = form.querySelector('input[name="staff"]:checked');
    document.getElementById('summaryStaff').textContent = staff ? (staffLabels[staff.value] || staff.value) : 'おまかせ';
  }

  // --- Navigation Buttons ---
  const step1Next = document.getElementById('step1Next');
  const step2Prev = document.getElementById('step2Prev');
  const step2Next = document.getElementById('step2Next');
  const step3Prev = document.getElementById('step3Prev');
  const step3Next = document.getElementById('step3Next');
  const step4Prev = document.getElementById('step4Prev');

  if (step1Next) step1Next.addEventListener('click', () => { if (validateStep1()) goToStep(2); });
  if (step2Prev) step2Prev.addEventListener('click', () => goToStep(1));
  if (step2Next) step2Next.addEventListener('click', () => { if (validateStep2()) goToStep(3); });
  if (step3Prev) step3Prev.addEventListener('click', () => goToStep(2));
  if (step3Next) step3Next.addEventListener('click', () => goToStep(4));
  if (step4Prev) step4Prev.addEventListener('click', () => goToStep(3));

  // --- Form Submit ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep4()) return;

    // Hide form, show success
    form.style.display = 'none';
    document.querySelector('.progress-bar').style.display = 'none';
    if (successScreen) {
      successScreen.style.display = 'block';
      successScreen.classList.add('active');
    }
  });

  // --- Staff pre-selection from URL ---
  const params = new URLSearchParams(window.location.search);
  const staffParam = params.get('staff');
  if (staffParam) {
    const staffInput = form.querySelector(`input[name="staff"][value="${staffParam}"]`);
    if (staffInput) staffInput.checked = true;
  }
});
