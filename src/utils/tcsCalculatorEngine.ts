export type AngleMode = 'DEG' | 'RAD';

export interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  keystrokes: string[];
  angleMode: AngleMode;
  timestamp: string;
}

export interface TCSCalculatorState {
  upperDisplay: string;
  lowerDisplay: string;
  angleMode: AngleMode;
  memoryValue: number;
  hasMemory: boolean;
  overwriteLower: boolean;
  lastUnaryExpr: string | null;
  openParenCount: number;
  evalChain: string;
  currentKeystrokes: string[];
  history: CalculationRecord[];
  errorState: boolean;
}

export const INITIAL_CALCULATOR_STATE: TCSCalculatorState = {
  upperDisplay: '',
  lowerDisplay: '0',
  angleMode: 'DEG',
  memoryValue: 0,
  hasMemory: false,
  overwriteLower: true,
  lastUnaryExpr: null,
  openParenCount: 0,
  evalChain: '',
  currentKeystrokes: [],
  history: [],
  errorState: false,
};

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

function formatTCSNumber(val: number): string {
  if (Number.isNaN(val)) return 'Invalid Input';
  if (!Number.isFinite(val)) return 'Infinity';
  if (Object.is(val, -0)) return '0';
  // Clean floating point noise like sin(30 deg) = 0.5000000000000001
  const rounded = Number(val.toPrecision(15));
  return String(rounded);
}

/**
 * Evaluates a TCS iON expression string containing custom binary operators:
 * '^' (power), 'YROOT' (y-th root of x), 'LOGBASE' (log_y(x)), 'MOD' (modulo),
 * and standard +, -, *, / with parentheses.
 */
function evaluateTCSExpression(rawExpr: string): number {
  const expr = rawExpr.trim();
  if (!expr) return 0;

  // Tokenize numbers (including scientific notation like 1.5e+3 or -4), operators, and parens
  const tokenRegex = /\s*([0-9]+(?:\.[0-9]+)?(?:e[+-]?[0-9]+)?|YROOT|LOGBASE|MOD|\+|\-|\*|\/|\^|\(|\))\s*/gi;
  const tokens: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = tokenRegex.exec(expr)) !== null) {
    tokens.push(match[1]);
  }

  // Handle unary minus at start or after '(' or another operator
  const normalized: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (
      t === '-' &&
      (i === 0 ||
        ['(', '+', '-', '*', '/', '^', 'YROOT', 'LOGBASE', 'MOD'].includes(
          tokens[i - 1].toUpperCase()
        )) &&
      i + 1 < tokens.length &&
      /^[0-9]/.test(tokens[i + 1])
    ) {
      normalized.push('-' + tokens[i + 1]);
      i++;
    } else {
      normalized.push(t);
    }
  }

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    MOD: 2,
    '^': 3,
    YROOT: 3,
    LOGBASE: 3,
  };

  const outputQueue: (number | string)[] = [];
  const opStack: string[] = [];

  for (const token of normalized) {
    const upper = token.toUpperCase();
    if (/^[+-]?[0-9]/.test(token)) {
      outputQueue.push(parseFloat(token));
    } else if (upper === '(') {
      opStack.push('(');
    } else if (upper === ')') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        outputQueue.push(opStack.pop()!);
      }
      if (opStack[opStack.length - 1] === '(') {
        opStack.pop();
      }
    } else if (upper in precedence) {
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== '(' &&
        precedence[opStack[opStack.length - 1]] >= precedence[upper]
      ) {
        outputQueue.push(opStack.pop()!);
      }
      opStack.push(upper);
    }
  }

  while (opStack.length > 0) {
    const op = opStack.pop()!;
    if (op !== '(' && op !== ')') {
      outputQueue.push(op);
    }
  }

  const evalStack: number[] = [];
  for (const item of outputQueue) {
    if (typeof item === 'number') {
      evalStack.push(item);
    } else {
      const b = evalStack.pop() ?? 0;
      const a = evalStack.pop() ?? 0;
      switch (item) {
        case '+':
          evalStack.push(a + b);
          break;
        case '-':
          evalStack.push(a - b);
          break;
        case '*':
          evalStack.push(a * b);
          break;
        case '/':
          evalStack.push(b === 0 ? NaN : a / b);
          break;
        case 'MOD':
          evalStack.push(b === 0 ? NaN : a % b);
          break;
        case '^':
          evalStack.push(Math.pow(a, b));
          break;
        case 'YROOT':
          evalStack.push(b === 0 ? NaN : Math.pow(a, 1 / b));
          break;
        case 'LOGBASE':
          evalStack.push(a <= 0 || b <= 0 || b === 1 ? NaN : Math.log(a) / Math.log(b));
          break;
        default:
          break;
      }
    }
  }

  return evalStack.length > 0 ? evalStack[evalStack.length - 1] : 0;
}

export function processTCSKey(
  state: TCSCalculatorState,
  key: string
): TCSCalculatorState {
  // Handle Angle Mode switch
  if (key === 'DEG' || key === 'RAD') {
    return {
      ...state,
      angleMode: key,
    };
  }

  // Handle Clear (C)
  if (key === 'C') {
    return {
      ...state,
      upperDisplay: '',
      lowerDisplay: '0',
      overwriteLower: true,
      lastUnaryExpr: null,
      openParenCount: 0,
      evalChain: '',
      currentKeystrokes: [],
      errorState: false,
    };
  }

  // Block other operations if in error state until 'C' or digit pressed
  if (state.errorState && !/^[0-9]$/.test(key)) {
    return {
      ...state,
      upperDisplay: '',
      lowerDisplay: '0',
      overwriteLower: true,
      lastUnaryExpr: null,
      openParenCount: 0,
      evalChain: '',
      errorState: false,
    };
  }

  const nextStrokes = [...state.currentKeystrokes, key];

  // Memory Operations: MC, MR, MS, M+, M-
  if (key === 'MC') {
    return {
      ...state,
      memoryValue: 0,
      hasMemory: false,
      currentKeystrokes: nextStrokes,
    };
  }
  if (key === 'MR') {
    return {
      ...state,
      lowerDisplay: formatTCSNumber(state.memoryValue),
      overwriteLower: true,
      lastUnaryExpr: null,
      currentKeystrokes: nextStrokes,
    };
  }
  if (key === 'MS') {
    const val = parseFloat(state.lowerDisplay) || 0;
    return {
      ...state,
      memoryValue: val,
      hasMemory: true,
      overwriteLower: true,
      currentKeystrokes: nextStrokes,
    };
  }
  if (key === 'M+') {
    const val = parseFloat(state.lowerDisplay) || 0;
    return {
      ...state,
      memoryValue: state.memoryValue + val,
      hasMemory: true,
      overwriteLower: true,
      currentKeystrokes: nextStrokes,
    };
  }
  if (key === 'M-') {
    const val = parseFloat(state.lowerDisplay) || 0;
    return {
      ...state,
      memoryValue: state.memoryValue - val,
      hasMemory: true,
      overwriteLower: true,
      currentKeystrokes: nextStrokes,
    };
  }

  // Backspace (<-)
  if (key === '<-') {
    if (state.overwriteLower || state.errorState) {
      return state;
    }
    const nextLower =
      state.lowerDisplay.length > 1 ? state.lowerDisplay.slice(0, -1) : '0';
    return {
      ...state,
      lowerDisplay: nextLower === '-' ? '0' : nextLower,
      currentKeystrokes: nextStrokes,
    };
  }

  // Digits 0-9
  if (/^[0-9]$/.test(key)) {
    if (state.overwriteLower || state.lowerDisplay === '0' || state.errorState) {
      return {
        ...state,
        lowerDisplay: key,
        overwriteLower: false,
        lastUnaryExpr: null,
        errorState: false,
        currentKeystrokes: nextStrokes,
      };
    }
    if (state.lowerDisplay.length >= 16) return state;
    return {
      ...state,
      lowerDisplay: state.lowerDisplay + key,
      currentKeystrokes: nextStrokes,
    };
  }

  // Decimal point (.)
  if (key === '.') {
    if (state.overwriteLower || state.errorState) {
      return {
        ...state,
        lowerDisplay: '0.',
        overwriteLower: false,
        lastUnaryExpr: null,
        errorState: false,
        currentKeystrokes: nextStrokes,
      };
    }
    if (state.lowerDisplay.includes('.')) return state;
    return {
      ...state,
      lowerDisplay: state.lowerDisplay + '.',
      currentKeystrokes: nextStrokes,
    };
  }

  // Constants: π and e
  if (key === 'π') {
    return {
      ...state,
      lowerDisplay: String(Math.PI),
      overwriteLower: true,
      lastUnaryExpr: null,
      currentKeystrokes: nextStrokes,
    };
  }
  if (key === 'e') {
    return {
      ...state,
      lowerDisplay: String(Math.E),
      overwriteLower: true,
      lastUnaryExpr: null,
      currentKeystrokes: nextStrokes,
    };
  }

  // Sign toggle (+/-)
  if (key === '+/-') {
    if (state.lowerDisplay === '0') return state;
    const toggled = state.lowerDisplay.startsWith('-')
      ? state.lowerDisplay.slice(1)
      : '-' + state.lowerDisplay;
    return {
      ...state,
      lowerDisplay: toggled,
      currentKeystrokes: nextStrokes,
    };
  }

  // Scientific Notation (Exp) -> appends 'e+' like TCS iON
  if (key === 'Exp') {
    if (state.lowerDisplay.includes('e')) return state;
    return {
      ...state,
      lowerDisplay: state.lowerDisplay + 'e+',
      overwriteLower: false,
      currentKeystrokes: nextStrokes,
    };
  }

  // Parentheses '(' and ')'
  if (key === '(') {
    return {
      ...state,
      upperDisplay: state.upperDisplay + '(',
      evalChain: state.evalChain + ' ( ',
      openParenCount: state.openParenCount + 1,
      overwriteLower: true,
      lastUnaryExpr: null,
      currentKeystrokes: nextStrokes,
    };
  }

  if (key === ')') {
    if (state.openParenCount <= 0) return state;
    const dispTerm = state.lastUnaryExpr ?? state.lowerDisplay;
    const nextUpper = state.upperDisplay + dispTerm + ')';
    const nextEval = state.evalChain + ' ' + state.lowerDisplay + ' ) ';
    const partialVal = evaluateTCSExpression(nextEval);
    return {
      ...state,
      upperDisplay: nextUpper,
      evalChain: nextEval,
      lowerDisplay: formatTCSNumber(partialVal),
      openParenCount: state.openParenCount - 1,
      overwriteLower: true,
      lastUnaryExpr: '',
      currentKeystrokes: nextStrokes,
    };
  }

  // Post-Fix Unary Functions (exact TCS iON behavior: enter value first, then press function)
  const currentVal = parseFloat(state.lowerDisplay);
  const toRad = (v: number) =>
    state.angleMode === 'DEG' ? (v * Math.PI) / 180 : v;
  const fromRad = (v: number) =>
    state.angleMode === 'DEG' ? (v * 180) / Math.PI : v;
  const suffix = state.angleMode === 'DEG' ? 'd' : 'r';
  const baseLabel = state.lastUnaryExpr || state.lowerDisplay;

  let unaryVal: number | null = null;
  let unaryDisplayLabel: string | null = null;

  switch (key) {
    case 'sin':
      unaryVal = Math.sin(toRad(currentVal));
      unaryDisplayLabel = `sin${suffix}(${baseLabel})`;
      break;
    case 'cos':
      unaryVal = Math.cos(toRad(currentVal));
      unaryDisplayLabel = `cos${suffix}(${baseLabel})`;
      break;
    case 'tan':
      unaryVal =
        state.angleMode === 'DEG' && Math.abs(currentVal % 180) === 90
          ? NaN
          : Math.tan(toRad(currentVal));
      unaryDisplayLabel = `tan${suffix}(${baseLabel})`;
      break;
    case 'sin⁻¹':
      unaryVal = currentVal < -1 || currentVal > 1 ? NaN : fromRad(Math.asin(currentVal));
      unaryDisplayLabel = `asin${suffix}(${baseLabel})`;
      break;
    case 'cos⁻¹':
      unaryVal = currentVal < -1 || currentVal > 1 ? NaN : fromRad(Math.acos(currentVal));
      unaryDisplayLabel = `acos${suffix}(${baseLabel})`;
      break;
    case 'tan⁻¹':
      unaryVal = fromRad(Math.atan(currentVal));
      unaryDisplayLabel = `atan${suffix}(${baseLabel})`;
      break;
    case 'sinh':
      unaryVal = Math.sinh(currentVal);
      unaryDisplayLabel = `sinh(${baseLabel})`;
      break;
    case 'cosh':
      unaryVal = Math.cosh(currentVal);
      unaryDisplayLabel = `cosh(${baseLabel})`;
      break;
    case 'tanh':
      unaryVal = Math.tanh(currentVal);
      unaryDisplayLabel = `tanh(${baseLabel})`;
      break;
    case 'sinh⁻¹':
      unaryVal = Math.asinh(currentVal);
      unaryDisplayLabel = `asinh(${baseLabel})`;
      break;
    case 'cosh⁻¹':
      unaryVal = currentVal < 1 ? NaN : Math.acosh(currentVal);
      unaryDisplayLabel = `acosh(${baseLabel})`;
      break;
    case 'tanh⁻¹':
      unaryVal =
        currentVal <= -1 || currentVal >= 1 ? NaN : Math.atanh(currentVal);
      unaryDisplayLabel = `atanh(${baseLabel})`;
      break;
    case 'ln':
      unaryVal = currentVal <= 0 ? NaN : Math.log(currentVal);
      unaryDisplayLabel = `ln(${baseLabel})`;
      break;
    case 'log':
      unaryVal = currentVal <= 0 ? NaN : Math.log10(currentVal);
      unaryDisplayLabel = `log(${baseLabel})`;
      break;
    case 'log₂x':
      unaryVal = currentVal <= 0 ? NaN : Math.log2(currentVal);
      unaryDisplayLabel = `log2(${baseLabel})`;
      break;
    case 'e^x':
      unaryVal = Math.exp(currentVal);
      unaryDisplayLabel = `powe(${baseLabel})`;
      break;
    case '10^x':
      unaryVal = Math.pow(10, currentVal);
      unaryDisplayLabel = `powten(${baseLabel})`;
      break;
    case 'x²':
      unaryVal = currentVal * currentVal;
      unaryDisplayLabel = `sqr(${baseLabel})`;
      break;
    case 'x³':
      unaryVal = currentVal * currentVal * currentVal;
      unaryDisplayLabel = `cube(${baseLabel})`;
      break;
    case '√':
      unaryVal = currentVal < 0 ? NaN : Math.sqrt(currentVal);
      unaryDisplayLabel = `sqrt(${baseLabel})`;
      break;
    case '³√x':
      unaryVal = Math.cbrt(currentVal);
      unaryDisplayLabel = `cubert(${baseLabel})`;
      break;
    case 'n!':
      unaryVal = factorial(currentVal);
      unaryDisplayLabel = `fact(${baseLabel})`;
      break;
    case '1/x':
      unaryVal = currentVal === 0 ? NaN : 1 / currentVal;
      unaryDisplayLabel = `reciproc(${baseLabel})`;
      break;
    case '|x|':
      unaryVal = Math.abs(currentVal);
      unaryDisplayLabel = `abs(${baseLabel})`;
      break;
    case '%':
      unaryVal = currentVal / 100;
      unaryDisplayLabel = `${baseLabel}%`;
      break;
    default:
      break;
  }

  if (unaryVal !== null && unaryDisplayLabel !== null) {
    const formatted = formatTCSNumber(unaryVal);
    const isErr = formatted === 'Invalid Input' || formatted === 'Infinity';
    return {
      ...state,
      lowerDisplay: formatted,
      lastUnaryExpr: unaryDisplayLabel,
      overwriteLower: true,
      errorState: isErr,
      currentKeystrokes: nextStrokes,
    };
  }

  // Binary Operators: +, -, *, /, mod, x^y, ʸ√x, log_y(x)
  const binaryMap: Record<string, { disp: string; evalOp: string }> = {
    '+': { disp: ' + ', evalOp: '+' },
    '-': { disp: ' - ', evalOp: '-' },
    '*': { disp: ' * ', evalOp: '*' },
    '/': { disp: ' / ', evalOp: '/' },
    mod: { disp: ' mod ', evalOp: 'MOD' },
    'x^y': { disp: ' ^ ', evalOp: '^' },
    'ʸ√x': { disp: ' yroot ', evalOp: 'YROOT' },
    'log_y(x)': { disp: ' log base ', evalOp: 'LOGBASE' },
  };

  if (key in binaryMap) {
    // Handle scientific notation sign switch if lowerDisplay ends with 'e+'
    if ((key === '-' || key === '+') && state.lowerDisplay.endsWith('e+')) {
      return {
        ...state,
        lowerDisplay: state.lowerDisplay.slice(0, -1) + key,
        currentKeystrokes: nextStrokes,
      };
    }

    const { disp, evalOp } = binaryMap[key];
    const termDisplay =
      state.lastUnaryExpr !== null ? state.lastUnaryExpr : state.lowerDisplay;
    const nextUpper =
      state.lastUnaryExpr === ''
        ? state.upperDisplay + disp
        : state.upperDisplay + termDisplay + disp;
    const nextEval =
      state.lastUnaryExpr === ''
        ? state.evalChain + ' ' + evalOp + ' '
        : state.evalChain + ' ' + state.lowerDisplay + ' ' + evalOp + ' ';

    // Show intermediate running total when outside parentheses
    const previewExpr = state.lastUnaryExpr === ''
      ? state.evalChain
      : state.evalChain + ' ' + state.lowerDisplay;
    const intermediate =
      state.openParenCount === 0 && previewExpr.trim()
        ? formatTCSNumber(evaluateTCSExpression(previewExpr))
        : state.lowerDisplay;

    return {
      ...state,
      upperDisplay: nextUpper,
      evalChain: nextEval,
      lowerDisplay: intermediate,
      overwriteLower: true,
      lastUnaryExpr: null,
      currentKeystrokes: nextStrokes,
    };
  }

  // Equals (=)
  if (key === '=') {
    const termDisplay =
      state.lastUnaryExpr !== null ? state.lastUnaryExpr : state.lowerDisplay;
    const fullUpper =
      state.lastUnaryExpr === ''
        ? state.upperDisplay
        : state.upperDisplay + termDisplay;
    const fullEval =
      state.lastUnaryExpr === ''
        ? state.evalChain
        : state.evalChain + ' ' + state.lowerDisplay;

    const finalVal = evaluateTCSExpression(fullEval);
    const formatted = formatTCSNumber(finalVal);
    const isErr = formatted === 'Invalid Input' || formatted === 'Infinity';

    const record: CalculationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      expression: fullUpper || state.lowerDisplay,
      result: formatted,
      keystrokes: nextStrokes,
      angleMode: state.angleMode,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    return {
      ...state,
      upperDisplay: '',
      lowerDisplay: formatted,
      overwriteLower: true,
      lastUnaryExpr: null,
      openParenCount: 0,
      evalChain: '',
      currentKeystrokes: [],
      history: [record, ...state.history].slice(0, 30),
      errorState: isErr,
    };
  }

  return state;
}
