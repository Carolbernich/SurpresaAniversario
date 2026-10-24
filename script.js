
(function () {
  const loginPanel = document.getElementById('login-panel');
  const introPanel = document.getElementById('intro-panel');
  const envelopesPanel = document.getElementById('envelopes-panel');
  const stepsPanel = document.getElementById('steps-panel');
  const finishPanel = document.getElementById('finish-panel');
  const riddleBox = document.getElementById('riddle-box');
  const form = document.getElementById('login-form');
  const error = document.getElementById('login-error');
  const nameInput = document.getElementById('name');
  const passwordInput = document.getElementById('password');

  

  let currentStep = 0;
  let guestName = 'Bruna';
  let openedThrough = -1;
  let selectedRiddle = -1;

  function show(panel) {
    [
      loginPanel,
      introPanel,
      envelopesPanel,
      stepsPanel,
      finishPanel
    ].forEach(function (p) {
      p.classList.add('hidden');
    });

    panel.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function normalizeAnswer(value) {
    return value
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9: ]/g, '')
      .replace(/\s+/g, ' ');
  }

  function isAnswerAccepted(answer, acceptedAnswers) {
    const normalized = normalizeAnswer(answer);

    return acceptedAnswers.some(function (item) {
      const accepted = normalizeAnswer(item);

      return normalized === accepted ||
        normalized.includes(accepted) ||
        accepted.includes(normalized);
    });
  }

  function normalizePassword(value) {
    return value
      .trim()
      .replace(/\s/g, '')
      .replace(/[.-]/g, '/');
  }

  function renderEnvelopes() {
    const grid = document.getElementById('envelope-grid');
    grid.innerHTML = '';

    steps.forEach(function (step, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'envelope-card';
      button.disabled = index > openedThrough;

      const icon = document.createElement('span');
      icon.className = 'envelope-icon';
      icon.textContent =
        index < openedThrough ? '💌' :
        index === openedThrough ? '✉️' : '🔒';
      icon.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.className = 'envelope-label';
      label.textContent =
        'Envelope ' + String(index + 1).padStart(2, '0');

      const status = document.createElement('span');
      status.className = 'envelope-status';
      status.textContent =
        index < openedThrough ? 'Concluído' :
        index === openedThrough ? 'Resolva a charada' : 'Bloqueado';

      button.append(icon, label, status);

      button.addEventListener('click', function () {
        if (index === openedThrough) {
          showRiddle(index);
        }
      });

      grid.appendChild(button);
    });
  }

  function showRiddle(index) {
    selectedRiddle = index;

    const riddle = riddles[index];

    document.getElementById('riddle-number').textContent =
      'DESAFIO ' + String(index + 1).padStart(2, '0');

    document.getElementById('riddle-title').textContent =
      riddle.title;

    document.getElementById('riddle-question').textContent =
      riddle.question;

    document.getElementById('riddle-answer').value = '';
    document.getElementById('riddle-feedback').textContent = '';

    riddleBox.classList.remove('hidden');
    riddleBox.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  document.getElementById('riddle-form')
    .addEventListener('submit', function (event) {
      event.preventDefault();

      if (selectedRiddle !== openedThrough) {
        return;
      }

      const answer =
        document.getElementById('riddle-answer').value;

      const feedback =
        document.getElementById('riddle-feedback');

      if (!isAnswerAccepted(
        answer,
        riddles[selectedRiddle].answers
      )) {
        feedback.textContent =
          'Ainda não! 💭 Dica: ' +
          riddles[selectedRiddle].hint;
        return;
      }

      currentStep = selectedRiddle;
      renderStep();
      riddleBox.classList.add('hidden');
      show(stepsPanel);
    });

  function renderStep() {
    const step = steps[currentStep];
    const number = String(currentStep + 1).padStart(2, '0');
    const percent = Math.round(
      ((currentStep + 1) / steps.length) * 100
    );

    document.getElementById('step-number').textContent =
      'ETAPA ' + number;

    document.getElementById('step-title').textContent =
      step.title;

    document.getElementById('step-body').innerHTML =
      step.body;

    document.getElementById('progress-label').textContent =
      'Instrução ' + (currentStep + 1) +
      ' de ' + steps.length;

    document.getElementById('progress-percent').textContent =
      percent + '%';

    document.getElementById('progress-fill').style.width =
      percent + '%';

    document.getElementById('next-button').textContent =
      currentStep === steps.length - 1
        ? 'Concluir missão ✓'
        : 'Próxima instrução →';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const typedName = nameInput.value.trim();
    const pass = normalizePassword(passwordInput.value);

    const valid = [
      '08/08/26',
      '08/08/2026',
      '080826',
      '08082026'
    ].includes(pass);

    if (!valid) {
      error.textContent =
        'Senha incorreta. Pense em uma data especial que vocês compartilham. 💭';

      passwordInput.setAttribute('aria-invalid', 'true');
      return;
    }

    guestName = typedName || 'Bruna';

    document.getElementById('welcome-title').textContent =
      'Bem-vinda, ' + guestName + '.';

    error.textContent = '';
    passwordInput.removeAttribute('aria-invalid');

    show(introPanel);
  });

  document.getElementById('begin-button')
    .addEventListener('click', function () {
      openedThrough = 0;
      currentStep = 0;
      riddleBox.classList.add('hidden');
      renderEnvelopes();
      show(envelopesPanel);
    });

  document.getElementById('next-button')
    .addEventListener('click', function () {
      if (currentStep === steps.length - 1) {
        show(finishPanel);
        return;
      }

      openedThrough = Math.max(
        openedThrough,
        currentStep + 1
      );

      riddleBox.classList.add('hidden');
      renderEnvelopes();
      show(envelopesPanel);
    });

  document.getElementById('restart-button')
    .addEventListener('click', function () {
      renderEnvelopes();
      show(envelopesPanel);
    });
    document.getElementById('login-button').addEventListener('click', function () {
  if (!form.reportValidity()) return;

  form.dispatchEvent(
    new Event('submit', {
      bubbles: true,
      cancelable: true
    })
  );
});
})();
