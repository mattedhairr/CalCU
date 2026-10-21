import React, { useEffect, useRef, useState } from 'react';
import { TCSCalculatorState, processTCSKey } from '../utils/tcsCalculatorEngine';

interface TCSCalculatorOverlayProps {
  calcState: TCSCalculatorState;
  setCalcState: React.Dispatch<React.SetStateAction<TCSCalculatorState>>;
  isOpen: boolean;
  onClose: () => void;
  opacity: number;
}

// Measured from the official calculator at
// tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html so the
// practice copy looks the same as the one in the exam (and in CalCU.exe).
const CALC_WIDTH = 463;
const KEY_W = 35;
const KEY_H = 25;
const COL_STEP = 40; // 35px key + 5px gap
const FIRST_ROW_TOP = 84;
const SECOND_ROW_TOP = 118; // row 1 has a 9px gap below it, the rest 5px
const ROW_STEP = 30;

type KeyVariant = 'grey' | 'red' | 'green';

interface KeyDef {
  id: string; // key name understood by processTCSKey
  label: React.ReactNode;
  col: number;
  row: number;
  colSpan?: number;
  rowSpan?: number;
  variant?: KeyVariant;
  small?: boolean; // trig and hyperbolic keys use 10.5px text
}

const sup = (base: string, power: string) => (
  <span>
    {base}
    <sup className="text-[0.7em]">{power}</sup>
  </span>
);
const sub = (base: string, index: string, tail: string) => (
  <span>
    {base}
    <sub className="text-[0.7em]">{index}</sub>
    {tail}
  </span>
);
// Glyphs the original draws at a custom size or offset.
const glyph = (text: string, size: number, top: number) => (
  <span className="relative" style={{ fontSize: size, top }}>
    {text}
  </span>
);
const yRootX = (
  <span>
    <span className="relative text-[8.4px]" style={{ top: -8 }}>
      y
    </span>
    <span className="-ml-[3px] text-[14.4px]">√x</span>
  </span>
);

const KEYS: KeyDef[] = [
  // Row 1: mod, (Deg/Rad radios), memory keys
  { id: 'mod', label: 'mod', col: 0, row: 1 },
  { id: 'MC', label: 'MC', col: 6, row: 1 },
  { id: 'MR', label: 'MR', col: 7, row: 1 },
  { id: 'MS', label: 'MS', col: 8, row: 1 },
  { id: 'M+', label: 'M+', col: 9, row: 1 },
  { id: 'M-', label: 'M-', col: 10, row: 1 },
  // Row 2
  { id: 'sinh', label: 'sinh', col: 0, row: 2, small: true },
  { id: 'cosh', label: 'cosh', col: 1, row: 2, small: true },
  { id: 'tanh', label: 'tanh', col: 2, row: 2, small: true },
  { id: 'Exp', label: 'Exp', col: 3, row: 2 },
  { id: '(', label: '(', col: 4, row: 2 },
  { id: ')', label: ')', col: 5, row: 2 },
  { id: '<-', label: <span className="text-[24px] leading-none">←</span>, col: 6, row: 2, colSpan: 2, variant: 'red' },
  { id: 'C', label: 'C', col: 8, row: 2, variant: 'red' },
  { id: '+/-', label: '+/-', col: 9, row: 2, variant: 'red' },
  { id: '√', label: glyph('√', 12, 1), col: 10, row: 2 },
  // Row 3
  { id: 'sinh⁻¹', label: sup('sinh', '-1'), col: 0, row: 3, small: true },
  { id: 'cosh⁻¹', label: sup('cosh', '-1'), col: 1, row: 3, small: true },
  { id: 'tanh⁻¹', label: sup('tanh', '-1'), col: 2, row: 3, small: true },
  { id: 'log₂x', label: sub('log', '2', 'x'), col: 3, row: 3 },
  { id: 'ln', label: 'ln', col: 4, row: 3 },
  { id: 'log', label: 'log', col: 5, row: 3 },
  { id: '7', label: '7', col: 6, row: 3 },
  { id: '8', label: '8', col: 7, row: 3 },
  { id: '9', label: '9', col: 8, row: 3 },
  { id: '/', label: '/', col: 9, row: 3 },
  { id: '%', label: '%', col: 10, row: 3 },
  // Row 4
  { id: 'π', label: 'π', col: 0, row: 4 },
  { id: 'e', label: 'e', col: 1, row: 4 },
  { id: 'n!', label: 'n!', col: 2, row: 4 },
  { id: 'log_y(x)', label: sub('log', 'y', 'x'), col: 3, row: 4 },
  { id: 'e^x', label: sup('e', 'x'), col: 4, row: 4 },
  { id: '10^x', label: sup('10', 'x'), col: 5, row: 4 },
  { id: '4', label: '4', col: 6, row: 4 },
  { id: '5', label: '5', col: 7, row: 4 },
  { id: '6', label: '6', col: 8, row: 4 },
  { id: '*', label: glyph('*', 20, 3), col: 9, row: 4 },
  { id: '1/x', label: '1/x', col: 10, row: 4 },
  // Row 5
  { id: 'sin', label: 'sin', col: 0, row: 5, small: true },
  { id: 'cos', label: 'cos', col: 1, row: 5, small: true },
  { id: 'tan', label: 'tan', col: 2, row: 5, small: true },
  { id: 'x^y', label: sup('x', 'y'), col: 3, row: 5 },
  { id: 'x³', label: sup('x', '3'), col: 4, row: 5 },
  { id: 'x²', label: sup('x', '2'), col: 5, row: 5 },
  { id: '1', label: '1', col: 6, row: 5 },
  { id: '2', label: '2', col: 7, row: 5 },
  { id: '3', label: '3', col: 8, row: 5 },
  { id: '-', label: glyph('-', 20, -1), col: 9, row: 5 },
  { id: '=', label: <span className="text-[20px]">=</span>, col: 10, row: 5, rowSpan: 2, variant: 'green' },
  // Row 6
  { id: 'sin⁻¹', label: sup('sin', '-1'), col: 0, row: 6, small: true },
  { id: 'cos⁻¹', label: sup('cos', '-1'), col: 1, row: 6, small: true },
  { id: 'tan⁻¹', label: sup('tan', '-1'), col: 2, row: 6, small: true },
  { id: 'ʸ√x', label: yRootX, col: 3, row: 6 },
  { id: '³√x', label: glyph('∛', 16, 0), col: 4, row: 6 },
  { id: '|x|', label: '|x|', col: 5, row: 6 },
  { id: '0', label: '0', col: 6, row: 6, colSpan: 2 },
  { id: '.', label: '.', col: 8, row: 6 },
  { id: '+', label: '+', col: 9, row: 6 },
];

// Fill colour, edge colour (1px sides and top, 3px bottom) and text colour.
const VARIANT_STYLE: Record<KeyVariant, string> = {
  grey: 'bg-[#f1f1f1] border-[#aaaaaa] text-[#444444] hover:bg-[#e6e6e6]',
  red: 'bg-[#e74c3c] border-[#c0392b] text-white hover:bg-[#dc4535]',
  green: 'bg-[#2ecc71] border-[#27ae60] text-white hover:bg-[#29c068]',
};

const rowTop = (row: number) =>
  row === 1 ? FIRST_ROW_TOP : SECOND_ROW_TOP + (row - 2) * ROW_STEP;

// In the original, keys to the right of the double-width ← and 0 keys, and
// the tall =, sit 1px further right.
const keyLeft = (key: KeyDef) =>
  10 + key.col * COL_STEP + (((key.row === 2 || key.row === 6) && key.col >= 8) || key.id === '=' ? 1 : 0);

export const TCSCalculatorOverlay: React.FC<TCSCalculatorOverlayProps> = ({
  calcState,
  setCalcState,
  isOpen,
  onClose,
  opacity,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number }>(() => ({
    x: typeof window !== 'undefined' ? Math.max(24, window.innerWidth - CALC_WIDTH - 40) : 600,
    y: 84,
  }));
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const nextX = Math.max(
        8,
        Math.min(window.innerWidth - CALC_WIDTH - 8, e.clientX - dragOffsetRef.current.x)
      );
      const nextY = Math.max(
        56,
        Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y)
      );
      setPosition({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleHeaderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleKeyClick = (key: string) => {
    setCalcState((prev) => processTCSKey(prev, key));
  };

  // As in the exam, typing on the keyboard does nothing: only clicks count.
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (/^[0-9+\-*/.=]$/.test(e.key) || e.key === 'Enter' || e.key === 'Backspace') {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: opacity / 100,
        width: CALC_WIDTH,
        fontFamily: 'Arial, Helvetica, sans-serif',
        // Native radios follow the page theme; the exam calculator is always light.
        colorScheme: 'light',
        boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.1), 0 20px 50px -12px rgba(0, 0, 0, 0.5)',
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="fixed top-0 left-0 z-50 overflow-hidden rounded-[5px] border border-b-[7px] border-[#aaaaaa] border-b-[#999999] bg-[#dadada] text-black outline-none"
    >
      {/* Title bar: drag to move */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className="relative h-[39px] cursor-move select-none bg-[#4286f3] p-[10px] text-[16px] leading-[19px] text-white"
      >
        Scientific Calculator
        <button
          type="button"
          onClick={() => setShowHelp((v) => !v)}
          className="absolute left-[328px] top-[7px] h-[25px] w-[54px] cursor-pointer rounded-[3px] bg-[#5bb7f7] text-[12px] font-bold text-white hover:bg-[#6fc0f8]"
        >
          {showHelp ? 'Back' : 'Help'}
        </button>
        <button
          type="button"
          onClick={() => setIsMinimized((v) => !v)}
          className="absolute left-[401px] top-[12px] h-[18px] w-[20px] cursor-pointer"
          aria-label={isMinimized ? 'Restore' : 'Minimize'}
        >
          <span className="absolute bottom-[1px] left-[2px] h-[3px] w-[16px] bg-white" />
        </button>
        <button
          type="button"
          onClick={onClose}
          className="absolute left-[431px] top-[10px] h-[20px] w-[20px] cursor-pointer"
          aria-label="Close"
        >
          <svg viewBox="0 0 16 16" className="absolute left-[2px] top-[2px] h-4 w-4" aria-hidden="true">
            <path d="M2 2L14 14M14 2L2 14" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {!isMinimized && showHelp && (
        <div className="mt-[5px] h-[278px] space-y-1.5 overflow-y-auto bg-white p-[10px] text-[12px] leading-snug">
          <p className="font-bold">How the GATE calculator works</p>
          <p>
            1. Press <b>C</b> before starting a new calculation.
          </p>
          <p>
            2. Functions are post-fix: enter the number first, then the function. For sin(30),
            click 3, 0, then <b>sin</b>.
          </p>
          <p>
            3. Check <b>Deg</b> / <b>Rad</b> before trigonometric functions. Hyperbolic functions
            are not affected by it.
          </p>
          <p>
            4. Two-input functions: for log<sub>y</sub>x, enter x, click log<sub>y</sub>x, enter
            y, then <b>=</b>. <sup>y</sup>√x works the same way.
          </p>
          <p>5. The keyboard is disabled in the exam, so practise with the mouse.</p>
        </div>
      )}

      {!isMinimized && !showHelp && (
        <div className="relative mt-[5px] h-[278px]">
          <input
            type="text"
            readOnly
            value={calcState.upperDisplay}
            aria-label="Expression"
            className="absolute left-[10px] top-[10px] h-[30px] w-[434px] cursor-default rounded-[3px] border border-b-[3px] border-[#aaaaaa] bg-white px-[5px] text-right text-[20px] outline-none"
          />
          <input
            type="text"
            readOnly
            value={calcState.lowerDisplay}
            aria-label="Current Value Display"
            className="absolute left-[10px] top-[47px] h-[30px] w-[434px] cursor-default rounded-[3px] border border-b-[3px] border-[#aaaaaa] bg-white px-[5px] text-right text-[20px] outline-none"
          />
          {calcState.hasMemory && (
            <span
              className="absolute left-[16px] top-[54px] text-[12px] font-bold text-[#444444]"
              title={`Memory: ${calcState.memoryValue}`}
            >
              M
            </span>
          )}

          <div className="absolute left-[55px] top-[84px] flex h-[25px] items-center gap-[7px] text-[9px]">
            {(['DEG', 'RAD'] as const).map((mode) => (
              <label key={mode} className="flex cursor-pointer items-center gap-[3px] pt-[1px]">
                <input
                  type="radio"
                  name="tcsAngleMode"
                  checked={calcState.angleMode === mode}
                  onChange={() => handleKeyClick(mode)}
                  className="m-0 cursor-pointer"
                />
                <span className="mt-[6px]">{mode === 'DEG' ? 'Deg' : 'Rad'}</span>
              </label>
            ))}
          </div>

          {KEYS.map((key) => {
            const colSpan = key.colSpan ?? 1;
            const rowSpan = key.rowSpan ?? 1;
            return (
              <button
                key={key.id}
                type="button"
                onClick={() => handleKeyClick(key.id)}
                style={{
                  left: keyLeft(key),
                  top: rowTop(key.row),
                  width: colSpan > 1 ? KEY_W + (colSpan - 1) * COL_STEP + 1 : KEY_W,
                  height: rowSpan > 1 ? KEY_H + (rowSpan - 1) * ROW_STEP - 2 : KEY_H,
                }}
                className={`tcs-key-base absolute flex cursor-pointer items-center justify-center rounded-[4px] border border-b-[3px] font-bold leading-[20px] ${
                  key.small ? 'text-[10.5px]' : 'text-[12px]'
                } ${VARIANT_STYLE[key.variant ?? 'grey']}`}
              >
                {key.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
