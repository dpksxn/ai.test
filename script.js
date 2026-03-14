const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

function updateDisplay() {
  resultEl.textContent = currentInput;
  expressionEl.textContent = previousInput
    ? `${previousInput} ${getOperatorSymbol(operator)}`
    : '';
}

function getOperatorSymbol(op) {
  const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
  return symbols[op] || '';
}

function inputDigit(digit) {
  if (shouldResetScreen) {
    currentInput = digit;
    shouldResetScreen = false;
  } else {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
}

function inputDecimal() {
  if (shouldResetScreen) {
    currentInput = '0.';
    shouldResetScreen = false;
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
}

function handleOperator(nextOperator) {
  const current = parseFloat(currentInput);

  if (operator && !shouldResetScreen) {
    const previous = parseFloat(previousInput);
    const result = calculate(previous, current, operator);
    currentInput = formatResult(result);
    previousInput = currentInput;
  } else {
    previousInput = currentInput;
  }

  operator = nextOperator;
  shouldResetScreen = true;
}

function calculate(a, b, op) {
  switch (op) {
    case 'add':      return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide':   return b !== 0 ? a / b : 'Error';
    default:         return b;
  }
}

function formatResult(value) {
  if (value === 'Error') return 'Error';
  const str = parseFloat(value.toPrecision(12)).toString();
  return str.length > 14 ? parseFloat(value).toExponential(6) : str;
}

function handleEquals() {
  if (!operator) return;
  const previous = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  const result = calculate(previous, current, operator);
  currentInput = formatResult(result);
  expressionEl.textContent = `${previousInput} ${getOperatorSymbol(operator)} ${current}`;
  previousInput = '';
  operator = null;
  shouldResetScreen = true;
}

function clear() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetScreen = false;
}

function toggleSign() {
  if (currentInput !== '0') {
    currentInput = currentInput.startsWith('-')
      ? currentInput.slice(1)
      : '-' + currentInput;
  }
}

function handlePercent() {
  currentInput = formatResult(parseFloat(currentInput) / 100);
}

function handleAction(action) {
  if (/^[0-9]$/.test(action)) {
    inputDigit(action);
  } else {
    switch (action) {
      case 'decimal':     inputDecimal(); break;
      case 'clear':       clear(); break;
      case 'toggle-sign': toggleSign(); break;
      case 'percent':     handlePercent(); break;
      case 'equals':      handleEquals(); updateDisplay(); return;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':      handleOperator(action); break;
    }
  }
  updateDisplay();
}

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (btn) handleAction(btn.dataset.action);
});

document.addEventListener('keydown', (e) => {
  const keyMap = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '.': 'decimal', '+': 'add', '-': 'subtract',
    '*': 'multiply', '/': 'divide',
    'Enter': 'equals', '=': 'equals',
    'Escape': 'clear', '%': 'percent',
  };
  if (keyMap[e.key]) {
    e.preventDefault();
    handleAction(keyMap[e.key]);
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateDisplay();
  }
});

updateDisplay();
