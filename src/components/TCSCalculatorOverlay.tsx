import React, { useState, useRef, useEffect } from 'react';
import {
  TCSCalculatorState,
  processTCSKey,
} from '../utils/tcsCalculatorEngine';
import {
  Copy,
  Check,
  RotateCcw,
  Globe,
  Cpu,
  GripHorizontal,
  HelpCircle,
  Minus,
  X,
} from 'lucide-react';

interface TCSCalculatorOverlayProps {
  calcState: TCSCalculatorState;
  setCalcState: React.Dispatch<React.SetStateAction<TCSCalculatorState>>;
  isOpen: boolean;
  onClose: () => void;
  hotkeyLabel: string;
  activeHighlightKey: string | null;
  opacity: number;
  setOpacity: (val: number) => void;
}

export const TCSCalculatorOverlay: React.FC<TCSCalculatorOverlayProps> = ({
  calcState,
  setCalcState,
  isOpen,
  onClose,
  hotkeyLabel,
  activeHighlightKey,
  opacity,
  setOpacity,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [engineMode, setEngineMode] = useState<'strict-replica' | 'live-iframe'>('strict-replica');
  const [copiedResult, setCopiedResult] = useState(false);
  const [keyboardWarning, setKeyboardWarning] = useState(false);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number }>(() => ({
    x: typeof window !== 'undefined' ? Math.max(24, window.innerWidth - 525) : 600,
    y: 84,
  }));
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const nextX = Math.max(
        8,
        Math.min(window.innerWidth - 490, e.clientX - dragOffsetRef.current.x)
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

  const handleCopyResult = () => {
    navigator.clipboard.writeText(calcState.lowerDisplay);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 1500);
  };

  const handleDisplayKeyDown = (e: React.KeyboardEvent) => {
    // In Strict GATE Exam mode, physical keyboard entry into the calculator is disabled
    if (/^[0-9+\-*/.=]$/.test(e.key) || e.key === 'Enter' || e.key === 'Backspace') {
      e.preventDefault();
      setKeyboardWarning(true);
      setTimeout(() => setKeyboardWarning(false), 2400);
    }
  };

  if (!isOpen) return null;

  const isHighlighted = (k: string) => activeHighlightKey === k;

  const renderBtn = (
    label: React.ReactNode,
    keyId: string,
    variant: 'func' | 'num' | 'red' | 'green' | 'mem' = 'func',
    extraClass = ''
  ) => {
    const baseStyle =
      'tcs-key-base h-[29px] rounded-[3px] border text-[11.5px] font-bold flex items-center justify-center cursor-pointer select-none whitespace-nowrap shrink-0';

    const variantStyles: Record<typeof variant, string> = {
      func: 'bg-gradient-to-b from-[#ffffff] to-[#e6e9ed] border-[#a3abb3] text-[#1e293b] hover:from-[#edf0f5] hover:to-[#dce1e7] hover:border-[#64748b]',
      num: 'bg-white border-[#a3abb3] text-[#0f172a] text-[13px] hover:bg-[#f1f5f9] hover:border-[#64748b]',
      red: 'bg-[#d9534f] border-[#c9302c] text-white hover:bg-[#c9302c]',
      green: 'bg-[#28a745] border-[#1e7e34] text-white text-[15px] hover:bg-[#218838]',
      mem: 'bg-[#dde2e8] border-[#a3abb3] text-[#1e293b] hover:bg-[#cfd6de]',
    };

    const highlightRing = isHighlighted(keyId)
      ? 'ring-2 ring-[#0284C7] ring-offset-1 scale-105 z-10 !bg-[#0284C7] !text-white !border-[#0369a1]'
      : '';

    return (
      <button
        type="button"
        onClick={() => handleKeyClick(keyId)}
        className={`${baseStyle} ${variantStyles[variant]} ${highlightRing} ${extraClass}`}
        title={`Click ${keyId}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        opacity: opacity / 100,
      }}
      onKeyDown={handleDisplayKeyDown}
      tabIndex={-1}
      className="fixed top-0 left-0 z-50 w-[482px] rounded-[5px] border-2 border-[#337ab7] bg-[#d9dde2] shadow-2xl outline-none"
    >
      {/* Authentic TCS iON Blue Title Bar (Draggable) */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className="flex items-center justify-between bg-[#337ab7] px-2.5 py-1.5 text-white cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-white/80 shrink-0" />
          <span className="text-[13px] font-bold tracking-tight font-sans whitespace-nowrap">
            Scientific Calculator
          </span>
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            className="ml-1 px-2 py-0.5 text-[11px] font-medium bg-[#286090] hover:bg-[#204d74] rounded text-white flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <HelpCircle className="w-3 h-3" />
            {showHelp ? 'Close Help' : 'Help'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-white/85 mr-1">
            {hotkeyLabel}
          </span>
          <button
            type="button"
            onClick={() => setIsMinimized((v) => !v)}
            className="w-5 h-5 rounded bg-[#286090] hover:bg-[#204d74] flex items-center justify-center text-white cursor-pointer"
            title={isMinimized ? 'Expand Calculator' : 'Minimize Calculator'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-5 h-5 rounded bg-[#d9534f] hover:bg-[#c9302c] flex items-center justify-center text-white cursor-pointer"
            title={`Hide Overlay (${hotkeyLabel})`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode & Opacity Sub-Bar */}
      {!isMinimized && (
        <div className="flex items-center justify-between px-2.5 py-1 bg-[#cfd5dc] border-b border-[#b8c0c8] text-[11px] text-[#334155]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setEngineMode('strict-replica')}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                engineMode === 'strict-replica'
                  ? 'bg-[#337ab7] text-white'
                  : 'text-[#334155] hover:bg-[#c2c9d1]'
              }`}
            >
              <Cpu className="w-3 h-3" />
              Strict GATE Mode
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('live-iframe')}
              className={`px-2 py-0.5 rounded font-medium flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap ${
                engineMode === 'live-iframe'
                  ? 'bg-[#337ab7] text-white'
                  : 'text-[#334155] hover:bg-[#c2c9d1]'
              }`}
            >
              <Globe className="w-3 h-3" />
              tcsion.com Live Frame
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 text-[10px] font-medium text-[#475569]">
              <span>Opacity {opacity}%</span>
              <input
                type="range"
                min={70}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-14 h-1 accent-[#337ab7] cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}

      {/* Official TCS iON Help Drawer */}
      {!isMinimized && showHelp && (
        <div className="p-3 bg-[#f8fafc] border-b border-[#cbd5e1] text-[11.5px] text-[#1e293b] max-h-[210px] overflow-y-auto space-y-1.5">
          <p className="font-bold text-[#0f172a]">
            Official GATE / TCS iON Scientific Calculator Instructions:
          </p>
          <p>
            1. <strong>Be sure to press [C]</strong> when beginning a new calculation.
          </p>
          <p>
            2. <strong>Post-Fix Unary Operations:</strong> Enter the angle or number FIRST, then click the function key. Example: For <code>sin(30)</code>, click <code>3</code> <code>0</code> then <code>sin</code>.
          </p>
          <p>
            3. <strong>Verify Deg / Rad Mode:</strong> Always check the radio button before evaluating trigonometric functions. Note: Hyperbolic functions (<code>sinh</code>, <code>cosh</code>, <code>tanh</code>) are unaffected by Deg/Rad.
          </p>
          <p>
            4. <strong>Two-Input Functions:</strong> For <code>log_y(x)</code>, enter <code>x</code> → click <code>log_y(x)</code> → enter base <code>y</code> → click <code>=</code>. For <code>ʸ√x</code>, enter <code>x</code> → click <code>ʸ√x</code> → enter root <code>y</code> → click <code>=</code>.
          </p>
          <p>
            5. <strong>No Physical Keyboard Typing:</strong> Physical numpad keys are disabled during the GATE exam. Practice clicking with your mouse!
          </p>
        </div>
      )}

      {/* Main Calculator Body */}
      {!isMinimized && engineMode === 'live-iframe' && (
        <div className="bg-[#e2e5e9] p-1.5">
          <iframe
            src="https://tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html"
            title="Official TCS iON Scientific Calculator"
            className="w-full h-[315px] rounded border border-[#94a3b8] bg-white"
          />
          <div className="mt-1 flex items-center justify-between px-1 text-[10px] text-[#475569]">
            <span>Source: tcsion.com/OnlineAssessment/ScientificCalculator/Calculator.html</span>
            <button
              type="button"
              onClick={() => setEngineMode('strict-replica')}
              className="text-[#0284c7] font-medium hover:underline cursor-pointer"
            >
              Switch to Instant Replica
            </button>
          </div>
        </div>
      )}

      {!isMinimized && engineMode === 'strict-replica' && (
        <div className="p-2 bg-[#e2e5e9]">
          {/* Dual Display Area (#keyPad_UserInput1 & #keyPad_UserInput) */}
          <div className="bg-white border border-[#8c96a3] rounded-[3px] px-2 py-1 mb-2 shadow-inner relative">
            {calcState.hasMemory && (
              <span
                className="absolute left-2 top-1 text-[11px] font-bold text-[#337ab7] font-mono"
                title={`Memory Stored: ${calcState.memoryValue}`}
              >
                M ({Number(calcState.memoryValue.toPrecision(6))})
              </span>
            )}
            <input
              type="text"
              readOnly
              value={calcState.upperDisplay}
              placeholder=""
              aria-label="Expression Chain Display"
              className="w-full h-[20px] text-right text-[12px] font-mono text-[#475569] bg-transparent border-none outline-none cursor-default"
            />
            <input
              type="text"
              readOnly
              value={calcState.lowerDisplay}
              aria-label="Current Value Display"
              className="w-full h-[26px] text-right text-[17px] font-bold font-mono text-[#0f172a] bg-transparent border-none outline-none cursor-default"
            />
          </div>

          {/* Physical Keyboard Warning Banner */}
          {keyboardWarning && (
            <div className="mb-1.5 px-2 py-1 rounded bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-[10.5px] font-medium flex items-center justify-between">
              <span>
                Strict GATE Mode: Keyboard typing is disabled in the real exam. Use mouse clicks!
              </span>
            </div>
          )}

          {/* ROW 1: mod | Deg / Rad | MC | MR | MS | M+ | M- */}
          <div className="grid grid-cols-11 gap-1 mb-1">
            <div className="col-span-1">{renderBtn('mod', 'mod', 'func', 'w-full')}</div>
            <div className="col-span-5 flex items-center justify-center gap-3 bg-[#d5d9de] border border-[#a3abb3] rounded-[3px] px-2 h-[29px] text-[11.5px] font-bold text-[#1e293b]">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tcsAngleMode"
                  checked={calcState.angleMode === 'DEG'}
                  onChange={() => handleKeyClick('DEG')}
                  className="accent-[#337ab7] cursor-pointer"
                />
                <span>Deg</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="tcsAngleMode"
                  checked={calcState.angleMode === 'RAD'}
                  onChange={() => handleKeyClick('RAD')}
                  className="accent-[#337ab7] cursor-pointer"
                />
                <span>Rad</span>
              </label>
            </div>
            <div className="col-span-1">{renderBtn('MC', 'MC', 'mem', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('MR', 'MR', 'mem', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('MS', 'MS', 'mem', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('M+', 'M+', 'mem', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('M-', 'M-', 'mem', 'w-full')}</div>
          </div>

          {/* ROW 2: sinh | cosh | tanh | Exp | ( | ) | <- (2 cols) | C | +/- | √ */}
          <div className="grid grid-cols-11 gap-1 mb-1">
            <div className="col-span-1">{renderBtn('sinh', 'sinh', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('cosh', 'cosh', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('tanh', 'tanh', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('Exp', 'Exp', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('(', '(', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn(')', ')', 'func', 'w-full')}</div>
            <div className="col-span-2">{renderBtn('←', '<-', 'red', 'w-full text-[14px]')}</div>
            <div className="col-span-1">{renderBtn('C', 'C', 'red', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('+/-', '+/-', 'red', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('√', '√', 'func', 'w-full text-[13px]')}</div>
          </div>

          {/* ROW 3: sinh⁻¹ | cosh⁻¹ | tanh⁻¹ | log₂x | ln | log | 7 | 8 | 9 | / | % */}
          <div className="grid grid-cols-11 gap-1 mb-1">
            <div className="col-span-1">
              {renderBtn(
                <span>
                  sinh<sup>-1</sup>
                </span>,
                'sinh⁻¹',
                'func',
                'w-full text-[10px]'
              )}
            </div>
            <div className="col-span-1">
              {renderBtn(
                <span>
                  cosh<sup>-1</sup>
                </span>,
                'cosh⁻¹',
                'func',
                'w-full text-[10px]'
              )}
            </div>
            <div className="col-span-1">
              {renderBtn(
                <span>
                  tanh<sup>-1</sup>
                </span>,
                'tanh⁻¹',
                'func',
                'w-full text-[10px]'
              )}
            </div>
            <div className="col-span-1">
              {renderBtn(
                <span>
                  log<sub>2</sub>x
                </span>,
                'log₂x',
                'func',
                'w-full text-[10.5px]'
              )}
            </div>
            <div className="col-span-1">{renderBtn('ln', 'ln', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('log', 'log', 'func', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('7', '7', 'num', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('8', '8', 'num', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('9', '9', 'num', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('/', '/', 'func', 'w-full text-[13px]')}</div>
            <div className="col-span-1">{renderBtn('%', '%', 'func', 'w-full')}</div>
          </div>

          {/* ROW 4: π | e | n! | log_y(x) | e^x | 10^x | 4 | 5 | 6 | * | 1/x */}
          <div className="grid grid-cols-11 gap-1 mb-1">
            <div className="col-span-1">{renderBtn('π', 'π', 'func', 'w-full text-[13px]')}</div>
            <div className="col-span-1">{renderBtn('e', 'e', 'func', 'w-full text-[13px]')}</div>
            <div className="col-span-1">{renderBtn('n!', 'n!', 'func', 'w-full')}</div>
            <div className="col-span-1">
              {renderBtn(
                <span>
                  log<sub>y</sub>x
                </span>,
                'log_y(x)',
                'func',
                'w-full text-[10.5px]'
              )}
            </div>
            <div className="col-span-1">
              {renderBtn(
                <span>
                  e<sup>x</sup>
                </span>,
                'e^x',
                'func',
                'w-full'
              )}
            </div>
            <div className="col-span-1">
              {renderBtn(
                <span>
                  10<sup>x</sup>
                </span>,
                '10^x',
                'func',
                'w-full'
              )}
            </div>
            <div className="col-span-1">{renderBtn('4', '4', 'num', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('5', '5', 'num', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('6', '6', 'num', 'w-full')}</div>
            <div className="col-span-1">{renderBtn('*', '*', 'func', 'w-full text-[14px]')}</div>
            <div className="col-span-1">{renderBtn('1/x', '1/x', 'func', 'w-full')}</div>
          </div>

          {/* ROWS 5 & 6 with 2-row tall '=' button on column 11 */}
          <div className="grid grid-cols-11 gap-1">
            <div className="col-span-10 space-y-1">
              {/* Row 5 (10 cols) */}
              <div className="grid grid-cols-10 gap-1">
                <div>{renderBtn('sin', 'sin', 'func', 'w-full')}</div>
                <div>{renderBtn('cos', 'cos', 'func', 'w-full')}</div>
                <div>{renderBtn('tan', 'tan', 'func', 'w-full')}</div>
                <div>
                  {renderBtn(
                    <span>
                      x<sup>y</sup>
                    </span>,
                    'x^y',
                    'func',
                    'w-full'
                  )}
                </div>
                <div>
                  {renderBtn(
                    <span>
                      x<sup>3</sup>
                    </span>,
                    'x³',
                    'func',
                    'w-full'
                  )}
                </div>
                <div>
                  {renderBtn(
                    <span>
                      x<sup>2</sup>
                    </span>,
                    'x²',
                    'func',
                    'w-full'
                  )}
                </div>
                <div>{renderBtn('1', '1', 'num', 'w-full')}</div>
                <div>{renderBtn('2', '2', 'num', 'w-full')}</div>
                <div>{renderBtn('3', '3', 'num', 'w-full')}</div>
                <div>{renderBtn('-', '-', 'func', 'w-full text-[15px]')}</div>
              </div>

              {/* Row 6 (10 cols, where '0' spans 2 cols) */}
              <div className="grid grid-cols-10 gap-1">
                <div>
                  {renderBtn(
                    <span>
                      sin<sup>-1</sup>
                    </span>,
                    'sin⁻¹',
                    'func',
                    'w-full text-[10.5px]'
                  )}
                </div>
                <div>
                  {renderBtn(
                    <span>
                      cos<sup>-1</sup>
                    </span>,
                    'cos⁻¹',
                    'func',
                    'w-full text-[10.5px]'
                  )}
                </div>
                <div>
                  {renderBtn(
                    <span>
                      tan<sup>-1</sup>
                    </span>,
                    'tan⁻¹',
                    'func',
                    'w-full text-[10.5px]'
                  )}
                </div>
                <div>
                  {renderBtn(
                    <span>
                      <sup>y</sup>√x
                    </span>,
                    'ʸ√x',
                    'func',
                    'w-full'
                  )}
                </div>
                <div>
                  {renderBtn(
                    <span>
                      <sup>3</sup>√x
                    </span>,
                    '³√x',
                    'func',
                    'w-full'
                  )}
                </div>
                <div>{renderBtn('|x|', '|x|', 'func', 'w-full')}</div>
                <div className="col-span-2">{renderBtn('0', '0', 'num', 'w-full')}</div>
                <div>{renderBtn('.', '.', 'num', 'w-full text-[15px]')}</div>
                <div>{renderBtn('+', '+', 'func', 'w-full text-[14px]')}</div>
              </div>
            </div>

            {/* Column 11: Tall Green '=' Button */}
            <div className="col-span-1">
              {renderBtn('=', '=', 'green', 'w-full !h-[62px]')}
            </div>
          </div>

          {/* Keystroke Audit & Quick Copy Strip */}
          <div className="mt-2 pt-1.5 border-t border-[#c4cbd4] flex items-center justify-between gap-2 text-[11px] text-[#334155]">
            <div className="flex items-center gap-1 overflow-x-auto max-w-[330px] py-0.5 font-mono text-[10.5px]">
              <span className="text-[#64748b] shrink-0">Keys:</span>
              {calcState.currentKeystrokes.length === 0 ? (
                <span className="text-[#64748b] italic">Click buttons above...</span>
              ) : (
                calcState.currentKeystrokes.slice(-9).map((k, idx) => (
                  <span
                    key={idx}
                    className="px-1 py-0.2 bg-white border border-[#cbd5e1] rounded text-[#0f172a] shrink-0"
                  >
                    {k}
                  </span>
                ))
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleKeyClick('C')}
                className="px-1.5 py-0.5 rounded bg-white border border-[#adb5bd] hover:bg-[#f1f5f9] text-[#334155] flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Reset Calculator"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
              <button
                type="button"
                onClick={handleCopyResult}
                className="px-2 py-0.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap"
                title="Copy lower display result for NAT answer box"
              >
                {copiedResult ? (
                  <>
                    <Check className="w-3 h-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy Value
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
