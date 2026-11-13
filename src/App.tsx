import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Activity, ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, BarChart3, BookOpen, Clock3, History, Pause, Play, RotateCw, Sparkles, Trophy, Users, X } from 'lucide-react';
import { Board as BoardType, Player, W, H, newPlayer, tick, move, rotate, hardDrop, penalty, relieve, boardWithPiece } from './game/engine';
import questionBank from './data/questions.json';
import easyBank from './data/questions-easy.json';

type Mode = 'solo-c' | 'solo-easy' | 'duel-c' | 'duel-easy';
type Match = { id: string; mode: string; players: string[]; score: number; lines: number; level: number; result: string; played_at: string };
type Stats = { totalMatches: number; averageScore: number; bestScore: number; worstScore: number; standardDeviation: number; totalLines: number };
type QuizQuestion = { question: string; answers: string[]; level: number };
type EasyQuestion = { question: string; answers: string[]; correct: number };
type Question =
  | { kind: 'typed'; prompt: string; answers: string[] }
  | { kind: 'choice'; prompt: string; options: string[]; correct: number };
type Outcome = { ok: boolean; who: number | null; reason: 'answer' | 'timeout' | 'noclaim' };
type Active = { q: Question; number: number; claimedBy: number | null; failed: number[]; result: Outcome | null; picked: number | null };
type Action = 'left' | 'right' | 'down' | 'up' | 'action';
type KeyLabel = { move: string; down: string; up: string; action: string };

const API = import.meta.env.VITE_API_URL ?? '';

const MODES: Record<Mode, { title: string; desc: string; kind: 'typed' | 'choice'; duel: boolean; icon: ReactNode }> = {
  'solo-c': { title: 'Solo C', desc: 'Programação em C com respostas digitadas.', kind: 'typed', duel: false, icon: <BookOpen /> },
  'solo-easy': { title: 'Solo Easy', desc: 'Conhecimentos gerais com 4 alternativas.', kind: 'choice', duel: false, icon: <Sparkles /> },
  'duel-c': { title: 'Duelo C', desc: 'Disputa local 1v1 com perguntas de C.', kind: 'typed', duel: true, icon: <Users /> },
  'duel-easy': { title: 'Duelo Easy', desc: 'Disputa local 1v1 com conhecimentos gerais.', kind: 'choice', duel: true, icon: <Users /> },
};

const MODE_LABEL: Record<string, string> = {
  'solo-c': 'Solo C',
  'solo-easy': 'Solo Easy',
  'duel-c': 'Duelo C',
  'duel-easy': 'Duelo Easy',
  classic: 'Desafio C',
  easy: 'Modo Easy',
  'local-duel': 'Duelo local',
};

const KEYSETS: Record<Action, string>[] = [
  { left: 'a', right: 'd', down: 's', up: 'w', action: ' ' },
  { left: 'ArrowLeft', right: 'ArrowRight', down: 'ArrowDown', up: 'ArrowUp', action: 'Enter' },
];

const KEY_LABELS: KeyLabel[] = [
  { move: 'A D', down: 'S', up: 'W', action: 'ESPAÇO' },
  { move: '← →', down: '↓', up: '↑', action: 'ENTER' },
];

const GAME_ACTION: Record<Action, string> = { left: 'left', right: 'right', down: 'down', up: 'rotate', action: 'drop' };

const QUESTION_EVERY = { solo: 5, duel: 6 };
const CLAIM_TIME = 10;
const ANSWER_TIME = { typed: 25, choice: 15 };
const RESULT_DELAY = 1400;

function readKey(key: string): { slot: number; action: Action } | null {
  const k = key.length === 1 ? key.toLowerCase() : key;
  for (let slot = 0; slot < KEYSETS.length; slot++) {
    for (const action of Object.keys(KEYSETS[slot]) as Action[]) {
      if (KEYSETS[slot][action] === k) return { slot, action };
    }
  }
  return null;
}

const normalize = (s: string) => s.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const cleanTitle = (s: string) => s.replace(/^\d+\.\s*/, '');
const cleanOption = (s: string) => s.replace(/^\d+\)\s*/, '');
const randomFrom = <T,>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

function pickQuestion(mode: Mode, level: number, used: Set<string>): Question {
  if (MODES[mode].kind === 'choice') {
    const bank = easyBank as EasyQuestion[];
    let pool = bank.filter(q => !used.has(q.question));
    if (!pool.length) {
      used.clear();
      pool = bank;
    }
    const q = randomFrom(pool);
    used.add(q.question);
    return { kind: 'choice', prompt: cleanTitle(q.question), options: q.answers.map(cleanOption), correct: q.correct };
  }
  const bank = questionBank as QuizQuestion[];
  const byLevel = bank.filter(q => q.level <= Math.min(5, level));
  let pool = (byLevel.length ? byLevel : bank).filter(q => !used.has(q.question));
  if (!pool.length) {
    used.clear();
    pool = byLevel.length ? byLevel : bank;
  }
  const q = randomFrom(pool);
  used.add(q.question);
  return { kind: 'typed', prompt: q.question, answers: q.answers };
}

function Board({ board, small = false }: { board: BoardType; small?: boolean }) {
  return (
    <div className={`board ${small ? 'small' : ''}`} style={{ gridTemplateColumns: `repeat(${W},1fr)` }}>
      {board.flatMap((row, y) => row.map((cell, x) => <div key={`${y}-${x}`} className={`cell ${cell ? 'filled' : ''}`} style={cell ? { background: cell, borderColor: cell } : undefined} />))}
    </div>
  );
}

function Controls({ act }: { act: (action: string) => void }) {
  return (
    <div className="controls" aria-label="Controles de jogo">
      <button aria-label="Mover para esquerda" onPointerDown={() => act('left')}><ArrowLeft /></button>
      <button aria-label="Descer peça" onPointerDown={() => act('down')}><ArrowDown /></button>
      <button aria-label="Mover para direita" onPointerDown={() => act('right')}><ArrowRight /></button>
      <button className="rotate" aria-label="Rotacionar peça" onPointerDown={() => act('rotate')}><RotateCw /> Girar</button>
      <button className="drop" aria-label="Soltar peça" onPointerDown={() => act('drop')}><ArrowDownToLine /> Soltar</button>
    </div>
  );
}

function KeyLegend({ slots }: { slots: number[] }) {
  const rows: [keyof KeyLabel, string][] = [['move', 'mover'], ['down', 'descer'], ['up', 'girar / pedir'], ['action', 'soltar / confirmar']];
  return (
    <div className="key-legend" aria-label="Teclas do jogo">
      {rows.map(([k, label]) => (
        <div key={k}>
          <span className="kbd-group">{slots.map(s => <kbd key={s}>{KEY_LABELS[s][k]}</kbd>)}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}

function hintText(active: Active, duel: boolean): string {
  const { q, claimedBy } = active;
  if (duel && claimedBy === null) return 'Aperte W (J1) ou ↑ (J2) para pedir a vez de responder!';
  if (q.kind === 'typed') return 'Digite a resposta e aperte ENTER para enviar.';
  if (!duel) return 'W/S ou ↑/↓ para escolher • ESPAÇO ou ENTER para confirmar';
  return claimedBy === 0 ? 'W/S para escolher • ESPAÇO para confirmar' : '↑/↓ para escolher • ENTER para confirmar';
}

function resultText(active: Active, duel: boolean, passNext: boolean): string {
  const r = active.result;
  if (!r) return '';
  if (r.reason === 'noclaim') return 'Ninguém respondeu a tempo • Pergunta ignorada';
  const name = duel ? `Jogador ${(r.who ?? 0) + 1}` : 'Você';
  if (r.ok) return `${name} acertou! +150 pontos`;
  const cost = duel ? `${name} sofreu penalidade (+1 linha)` : 'Linha de penalidade adicionada';
  if (passNext) return `${name} errou! Passando a vez...`;
  return r.reason === 'timeout' ? `Tempo esgotado • ${cost}` : `${name} errou • ${cost}`;
}

type ModalProps = {
  active: Active;
  duel: boolean;
  qTime: number;
  qMax: number;
  sel: number;
  typed: string;
  inputRef: RefObject<HTMLInputElement>;
  onTyped: (value: string) => void;
  onSubmitTyped: () => void;
  onPick: (index: number) => void;
};

function QuestionModal(p: ModalProps) {
  const { active, duel, qTime, qMax, sel, typed } = p;
  const { q, claimedBy, failed, result } = active;
  const canAnswer = !duel || claimedBy !== null;
  const time = Math.max(0, qTime);
  const passNext = !!result && duel && !result.ok && result.who !== null && result.reason !== 'noclaim' && failed.length === 0;

  return (
    <div className="modal-shade q-shade" role="dialog" aria-modal="true" aria-label="Pergunta">
      <div className={`q-card ${duel && claimedBy !== null ? `q-p${claimedBy}` : ''}`}>
        <div className="quiz-label"><BookOpen size={16} /> {q.kind === 'typed' ? 'DESAFIO DE C' : 'CONHECIMENTOS GERAIS'} <span>#{String(active.number).padStart(2, '0')}</span></div>
        <div className="quiz-progress"><i style={{ width: `${(time / qMax) * 100}%` }} /></div>
        <div className="timer"><Clock3 size={16} /> 00:{String(time).padStart(2, '0')}</div>

        {duel && claimedBy === null && (
          <div className="claim-row">
            {[0, 1].map(s => (
              <div key={s} className={`claim-pill q-p${s} ${failed.includes(s) ? 'out' : ''}`}>
                <kbd>{s === 0 ? 'W' : '↑'}</kbd>
                <b>JOGADOR {s + 1}</b>
                <small>{failed.includes(s) ? 'já errou esta pergunta' : `Aperte ${s === 0 ? 'W' : '↑'} para responder`}</small>
              </div>
            ))}
          </div>
        )}
        {duel && claimedBy !== null && <div className={`claim-banner q-p${claimedBy}`}>JOGADOR {claimedBy + 1} NA VEZ</div>}

        <h2>{q.prompt}</h2>

        {q.kind === 'choice' ? (
          <div className="q-options">
            {q.options.map((option, i) => {
              const cls = ['q-option'];
              const isOptionFailed = failed.length > 0 && active.picked === i;
              if (canAnswer && !result && sel === i) cls.push('selected');
              if (result && result.ok && i === q.correct) cls.push('correct');
              if (result && !result.ok && active.picked === i) cls.push('wrong');
              if (isOptionFailed) cls.push('wrong-disabled');
              if (!canAnswer) cls.push('idle');

              return (
                <button
                  key={i}
                  className={cls.join(' ')}
                  disabled={!!result || !canAnswer || isOptionFailed}
                  onClick={() => p.onPick(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>{option}
                </button>
              );
            })}
          </div>
        ) : (
          <form className="q-typed" onSubmit={e => { e.preventDefault(); p.onSubmitTyped(); }}>
            <input
              ref={p.inputRef}
              aria-label="Sua resposta"
              value={typed}
              onChange={e => p.onTyped(e.target.value)}
              disabled={!canAnswer || !!result}
              placeholder={canAnswer ? 'Digite sua resposta e pressione Enter…' : 'Aguardando quem vai responder…'}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button disabled={!typed.trim() || !canAnswer || !!result}>ENVIAR <kbd>ENTER</kbd></button>
          </form>
        )}

        {result ? (
          <div className={`q-result ${result.ok ? 'ok' : 'bad'}`} aria-live="polite">
            <b>{resultText(active, duel, passNext)}</b>
            {!result.ok && !passNext && result.reason !== 'noclaim' && q.kind === 'typed' && (
              <span>Resposta esperada: <code>{q.answers[0]}</code></span>
            )}
            {passNext && <span>Vez passada para o Jogador {2 - (result.who ?? 0)}!</span>}
          </div>
        ) : (
          <div className="q-hint">{hintText(active, duel)}</div>
        )}
      </div>
    </div>
  );
}

export function App() {
  const [view, setView] = useState<'home' | 'play' | 'history' | 'stats'>('home');
  const [mode, setMode] = useState<Mode>('solo-c');
  const [menuIndex, setMenuIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<Active | null>(null);
  const [qTime, setQTime] = useState(0);
  const [qMax, setQMax] = useState(CLAIM_TIME);
  const [sel, setSel] = useState(0);
  const [typed, setTyped] = useState('');
  const [locks, setLocks] = useState(0);
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState<Match[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const playersRef = useRef(players);
  playersRef.current = players;
  const prevNext = useRef<unknown[]>([]);
  const usedRef = useRef<Set<string>>(new Set());
  const qNumber = useRef(0);
  const busy = useRef(false);
  const savedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const keyHandler = useRef<(e: KeyboardEvent) => void>(() => {});

  const isDuel = MODES[mode].duel;
  const anyOver = players.some(p => p.over);
  const duelWinner = isDuel && anyOver
    ? (players.every(p => p.over) ? (players[0].score >= players[1].score ? 0 : 1) : 1 - players.findIndex(p => p.over))
    : null;
  const gameOver = isDuel ? duelWinner !== null : !!players[0]?.over;

  const menuItems: { id: Mode | 'stats' | 'history'; label: string }[] = [
    { id: 'solo-c', label: 'Solo C' },
    { id: 'solo-easy', label: 'Solo Easy' },
    { id: 'duel-c', label: 'Duelo C' },
    { id: 'duel-easy', label: 'Duelo Easy' },
    { id: 'stats', label: 'Estatísticas' },
  ];

  const setP = (i: number, fn: (p: Player) => Player) => setPlayers(prev => prev.map((p, index) => (index === i ? fn(p) : p)));

  const begin = (selected: Mode) => {
    (document.activeElement as HTMLElement | null)?.blur?.();
    setMode(selected);
    setPlayers(Array.from({ length: MODES[selected].duel ? 2 : 1 }, () => newPlayer()));
    setView('play');
    setPaused(false);
    setActive(null);
    setLocks(0);
    setQTime(0);
    setSel(0);
    setTyped('');
    setNotice('');
    prevNext.current = [];
    usedRef.current = new Set();
    qNumber.current = 0;
    busy.current = false;
    savedRef.current = false;
  };
  const start = () => begin(mode);

  const act = useCallback((action: string, index = 0) => setPlayers(prev => prev.map((p, i) => {
    if (i !== index) return p;
    if (action === 'left') return move(p, -1);
    if (action === 'right') return move(p, 1);
    if (action === 'down') return move(p, 0, 1);
    if (action === 'rotate') return rotate(p);
    if (action === 'drop') return hardDrop(p);
    return p;
  })), []);

  const openQuestion = () => {
    const level = Math.max(1, ...playersRef.current.map(p => p.level));
    qNumber.current += 1;
    const q = pickQuestion(mode, level, usedRef.current);
    const time = isDuel ? CLAIM_TIME : ANSWER_TIME[q.kind];
    busy.current = false;
    setActive({ q, number: qNumber.current, claimedBy: null, failed: [], result: null, picked: null });
    setSel(0);
    setTyped('');
    setQMax(time);
    setQTime(time);
  };

  const claim = (slot: number) => {
    if (!active || active.result || active.claimedBy !== null || active.failed.includes(slot)) return;
    const time = ANSWER_TIME[active.q.kind];
    setActive({ ...active, claimedBy: slot });
    setSel(0);
    setTyped('');
    setQMax(time);
    setQTime(time);
  };

  const settle = (who: number | null, ok: boolean, reason: Outcome['reason'], picked: number | null = null) => {
    if (busy.current) return;
    busy.current = true;
    if (who !== null) setP(who, p => (ok ? relieve({ ...p, score: p.score + 150 }) : penalty(p)));
    setActive(a => (a ? { ...a, picked, result: { ok, who, reason } } : a));
  };

  const submitChoice = (index: number) => {
    if (!active || active.result) return;
    const q = active.q;
    if (q.kind !== 'choice') return;
    const who = isDuel ? active.claimedBy : 0;
    if (who === null) return;
    settle(who, index === q.correct, 'answer', index);
  };

  const submitTyped = () => {
    if (!active || active.result) return;
    const q = active.q;
    if (q.kind !== 'typed') return;
    const who = isDuel ? active.claimedBy : 0;
    const value = normalize(typed);
    if (who === null || !value) return;
    settle(who, q.answers.some(a => normalize(a) === value), 'answer');
    setTyped('');
  };

  const pickOption = (index: number) => {
    if (isDuel && active?.claimedBy === null) return;
    setSel(index);
    submitChoice(index);
  };

  const questionKey = (hit: { slot: number; action: Action }, repeat: boolean) => {
    if (!active || active.result) return;
    if (isDuel) {
      if (active.claimedBy === null) {
        if (hit.action === 'up' && !repeat) claim(hit.slot);
        return;
      }
      if (hit.slot !== active.claimedBy) return;
    }
    const q = active.q;
    if (q.kind !== 'choice') return;
    const count = q.options.length;
    if (hit.action === 'up') setSel(s => (s + count - 1) % count);
    else if (hit.action === 'down') setSel(s => (s + 1) % count);
    else if (hit.action === 'action' && !repeat) submitChoice(sel);
  };

  keyHandler.current = (e: KeyboardEvent) => {
    if (view === 'home') {
      const isUp = e.key === 'ArrowUp' || e.key.toLowerCase() === 'w';
      const isDown = e.key === 'ArrowDown' || e.key.toLowerCase() === 's';

      if (isUp) {
        e.preventDefault();
        setMenuIndex(i => (i + menuItems.length - 1) % menuItems.length);
      } else if (isDown) {
        e.preventDefault();
        setMenuIndex(i => (i + 1) % menuItems.length);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selected = menuItems[menuIndex].id;
        if (selected === 'stats') {
          setView('stats');
          void loadStats();
        } else {
          begin(selected as Mode);
        }
      }
      return;
    }

    if (view !== 'play') return;
    if (e.key === 'Escape') {
      if (!gameOver) setPaused(v => !v);
      return;
    }
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
    if (e.key.toLowerCase() === 'p') {
      if (!gameOver) setPaused(v => !v);
      return;
    }
    if (paused || gameOver) return;
    if (active && !active.result && active.q.kind === 'typed' && (!isDuel || active.claimedBy !== null)) {
      inputRef.current?.focus();
      return;
    }
    const hit = readKey(e.key);
    if (!hit) return;
    e.preventDefault();
    if (target && target.tagName === 'BUTTON') target.blur();
    if (active) {
      questionKey(hit, e.repeat);
      return;
    }
    if (e.repeat && (hit.action === 'up' || hit.action === 'action')) return;
    act(GAME_ACTION[hit.action], isDuel ? hit.slot : 0);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => keyHandler.current(e);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [view]);

  useEffect(() => {
    if (view !== 'play' || paused || active || gameOver) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setPlayers(ps => ps.map(p => tick(p, dt)));
    }, 40);
    return () => clearInterval(id);
  }, [view, paused, active, gameOver]);

  useEffect(() => {
    if (view !== 'play') return;
    let n = 0;
    players.forEach((p, i) => {
      const before = prevNext.current[i];
      if (before && before !== p.next) n += 1;
      prevNext.current[i] = p.next;
    });
    if (n) setLocks(l => l + n);
  }, [players, view]);

  useEffect(() => {
    if (view !== 'play' || active || paused || gameOver) return;
    const need = isDuel ? QUESTION_EVERY.duel : QUESTION_EVERY.solo;
    if (locks >= need) {
      setLocks(0);
      openQuestion();
    }
  }, [locks, view, active, paused, gameOver]);

  useEffect(() => {
    if (!active || active.result || paused || view !== 'play') return;
    const id = window.setInterval(() => setQTime(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [active?.result, !!active, paused, view]);

  useEffect(() => {
    if (!active || active.result || qTime > 0) return;
    if (!isDuel) settle(0, false, 'timeout');
    else if (active.claimedBy === null) settle(null, false, 'noclaim');
    else settle(active.claimedBy, false, 'timeout');
  }, [qTime]);

  useEffect(() => {
    if (!active?.result) return;
    const id = window.setTimeout(() => {
      const a = active;
      const r = a.result;
      const ended = playersRef.current.some(p => p.over);
      if (!ended && isDuel && r && !r.ok && r.who !== null && r.reason !== 'noclaim' && a.failed.length === 0) {
        busy.current = false;
        setActive({ ...a, claimedBy: null, failed: [r.who], result: null });
        setSel(0);
        setTyped('');
        setQMax(CLAIM_TIME);
        setQTime(CLAIM_TIME);
      } else {
        setActive(null);
      }
    }, RESULT_DELAY);
    return () => clearTimeout(id);
  }, [active?.result]);

  useEffect(() => {
    if (!active || active.result || paused) return;
    if (active.q.kind !== 'typed') return;
    if (isDuel && active.claimedBy === null) return;
    inputRef.current?.focus();
  }, [active?.q, active?.claimedBy, active?.result, paused]);

  useEffect(() => {
    if (view !== 'play' || !gameOver || savedRef.current) return;
    savedRef.current = true;
    void saveMatch();
  }, [view, gameOver]);

  async function saveMatch() {
    const winner = isDuel ? players[duelWinner ?? 0] : players[0];
    if (!winner) return;
    try {
      const r = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          players: isDuel ? ['Jogador 1', 'Jogador 2'] : ['Jogador'],
          score: winner.score,
          lines: winner.lines,
          level: winner.level,
          result: isDuel ? `Jogador ${(duelWinner ?? 0) + 1} venceu` : 'Game over',
        }),
      });
      if (!r.ok) throw Error();
    } catch {
      setNotice('Partida encerrada (modo offline local).');
    }
  }

  async function loadHistory() {
    setLoading(true);
    try {
      const r = await fetch('/api/history');
      if (!r.ok) throw Error();
      setHistory(await r.json());
    } catch {
      setHistory([]);
    }
    setLoading(false);
  }

  async function loadStats() {
    setLoading(true);
    try {
      const r = await fetch('/api/stats');
      if (!r.ok) throw Error();
      setStats(await r.json());
    } catch {
      setStats({ totalMatches: 0, averageScore: 0, bestScore: 0, worstScore: 0, standardDeviation: 0, totalLines: 0 });
    }
    setLoading(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView('home')} aria-label="TECTRIS início">
          <span className="brand-mark">T</span><span>TEC<span className="accent">TRIS</span><small>APRENDA JOGANDO</small></span>
        </button>
        <div className="top-actions">
          <span className="status"><i /> SISTEMA PRONTO</span>
          <button className="icon-button" onClick={() => { setView('history'); void loadHistory(); }} aria-label="Histórico"><History /></button>
        </div>
      </header>

      {view === 'home' && (
        <main className="home-vertical">
          <div className="home-header">
            <div className="eyebrow"><Sparkles size={15} /> APRENDER TAMBÉM É JOGAR</div>
            <h1>TECTRIS <span>MODOS</span></h1>
            <p>Use W / S ou ↑ / ↓ para navegar. Pressione ENTER para jogar.</p>
          </div>

          <div className="vertical-menu">
            {(Object.keys(MODES) as Mode[]).map((id, idx) => (
              <button
                key={id}
                className={`vertical-card ${menuIndex === idx ? 'active-selection' : ''}`}
                onClick={() => begin(id)}
                onMouseEnter={() => setMenuIndex(idx)}
              >
                <div className="card-selector">{menuIndex === idx ? '▶' : ''}</div>
                <div className="card-icon">{MODES[id].icon}</div>
                <div className="card-details">
                  <b>{MODES[id].title}</b>
                  <small>{MODES[id].desc}</small>
                </div>
                <div className="card-badge">{MODES[id].duel ? '2 JOGADORES' : '1 JOGADOR'}</div>
              </button>
            ))}

            <button
              className={`vertical-card ${menuIndex === 4 ? 'active-selection' : ''}`}
              onClick={() => { setView('stats'); void loadStats(); }}
              onMouseEnter={() => setMenuIndex(4)}
            >
              <div className="card-selector">{menuIndex === 4 ? '▶' : ''}</div>
              <div className="card-icon"><BarChart3 /></div>
              <div className="card-details">
                <b>Estatísticas</b>
                <small>Veja o desempenho geral das partidas</small>
              </div>
              <div className="card-badge">DESEMPENHO</div>
            </button>
          </div>
        </main>
      )}

      {view === 'play' && (
        <main className="game-view">
          <div className="game-head">
            <button className="back-link" onClick={() => setView('home')}>← MENU</button>
            <div className="game-title"><span className="live-dot" /> {MODES[mode].title.toUpperCase()}</div>
            <button className="pause-btn" onClick={() => setPaused(v => !v)}>{paused ? <Play /> : <Pause />} {paused ? 'CONTINUAR' : 'PAUSAR'}</button>
          </div>
          {notice && <p className="save-notice">{notice}</p>}
          <div className={`game-layout ${isDuel ? 'duel' : 'solo'}`}>
            {players.map((p, i) => (
              <section className={`player-panel ${isDuel ? `duel-player-${i + 1}` : ''}`} key={i}>
                <div className="player-heading">
                  <span>PLAYER 0{i + 1}</span>
                  <strong>{isDuel ? `Jogador ${i + 1} · ${i === 0 ? 'WASD' : 'SETAS'}` : 'JOGADOR'}</strong>
                </div>

                <div className={`player-body ${i === 1 ? 'reversed' : ''}`}>
                  {/* Jogador 1 tem Placar na Esquerda; Jogador 2 tem Placar na Direita */}
                  <div className="side-info">
                    <div className="stat-box"><small>SCORE</small><b>{String(p.score).padStart(6, '0')}</b></div>
                    <div className="stat-box"><small>LINES</small><b>{p.lines}</b></div>
                    <div className="stat-box"><small>LEVEL</small><b>{p.level}</b></div>
                  </div>

                  <div className="board-wrap">
                    <Board board={boardWithPiece(p)} />
                    <div className="kill-line" style={{ top: `${(p.penalty / H) * 100}%` }}><span>KILL LINE</span></div>
                    {p.over && !isDuel && <div className="board-over"><b>GAME OVER</b><button onClick={start}>JOGAR DE NOVO</button></div>}
                    {p.over && isDuel && <div className="board-over"><b>GAME OVER</b></div>}
                  </div>

                  <div className="side-info">
                    <div className="next-piece">
                      <span>PRÓXIMA</span>
                      <div>
                        {p.next.shape.map((row, y) => (
                          <div key={y} className="mini-row">
                            {row.map((v, x) => <i key={x} style={v ? { background: p.next.color } : undefined} />)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <KeyLegend slots={isDuel ? [i] : [0, 1]} />
                <Controls act={a => act(a, i)} />
              </section>
            ))}
            {isDuel && <div className="duel-center"><div className="versus">VS</div></div>}
          </div>

          {active && (
            <QuestionModal
              active={active}
              duel={isDuel}
              qTime={qTime}
              qMax={qMax}
              sel={sel}
              typed={typed}
              inputRef={inputRef}
              onTyped={setTyped}
              onSubmitTyped={submitTyped}
              onPick={pickOption}
            />
          )}

          {isDuel && duelWinner !== null && (
            <div className="modal-shade">
              <div className="modal winner-modal">
                <div className="modal-icon"><Trophy /></div>
                <div className="section-label">PARTIDA ENCERRADA</div>
                <h2>JOGADOR {duelWinner + 1} VENCEU!</h2>
                <p>O tabuleiro do adversário atingiu o topo.</p>
                <button className="primary" onClick={start}><Play size={16} /> NOVA PARTIDA</button>
                <button className="secondary" onClick={() => setView('home')}>VOLTAR AO MENU</button>
              </div>
            </div>
          )}

          {paused && !gameOver && (
            <div className="modal-shade pause-shade">
              <div className="modal">
                <button className="close" onClick={() => setPaused(false)}><X /></button>
                <div className="modal-icon"><Pause /></div>
                <h2>PAUSA</h2>
                <p>O jogo está congelado.</p>
                <button className="primary" onClick={() => setPaused(false)}><Play size={16} /> CONTINUAR PARTIDA</button>
              </div>
            </div>
          )}
        </main>
      )}

      {view === 'history' && (
        <main className="content-view">
          <div className="section-label">SEU PROGRESSO</div>
          <h1>Histórico de <span>partidas</span></h1>
          <p className="subhead">Seus resultados locais e ranking.</p>
          {loading ? <div className="empty-state">Carregando partidas…</div> : history.length === 0 ? (
            <div className="empty-state"><History /><b>Nenhuma partida registrada</b><span>Jogue uma partida para salvar.</span></div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>DATA</th><th>MODO</th><th>JOGADOR</th><th>PONTOS</th><th>LINHAS</th><th>NÍVEL</th><th>RESULTADO</th></tr></thead>
                <tbody>{history.map(h => <tr key={h.id}><td>{new Date(h.played_at).toLocaleString('pt-BR')}</td><td>{MODE_LABEL[h.mode] ?? h.mode}</td><td>{h.players.join(' × ')}</td><td className="cyan">{h.score}</td><td>{h.lines}</td><td>{h.level}</td><td>{h.result}</td></tr>)}</tbody>
              </table>
            </div>
          )}
          <button className="secondary" onClick={() => setView('home')}>← VOLTAR AO MENU</button>
        </main>
      )}

      {view === 'stats' && (
        <main className="content-view">
          <div className="section-label">ANÁLISE DE DESEMPENHO</div>
          <h1>Suas <span>estatísticas</span></h1>
          <p className="subhead">Visão geral do desempenho.</p>
          {loading ? <div className="empty-state">Calculando…</div> : (
            <div className="stats-grid">
              {[['PARTIDAS', stats?.totalMatches ?? 0], ['MÉDIA DE PONTOS', Math.round(stats?.averageScore ?? 0)], ['MELHOR PONTUAÇÃO', stats?.bestScore ?? 0], ['LINHAS ELIMINADAS', stats?.totalLines ?? 0], ['MENOR PONTUAÇÃO', stats?.worstScore ?? 0], ['CONSISTÊNCIA', Math.round(stats?.standardDeviation ?? 0)]].map(([label, value]) => (
                <div className="stat-card" key={String(label)}><small>{label}</small><b>{value}</b><span>{label === 'CONSISTÊNCIA' ? 'DESVIO PADRÃO' : <Trophy size={14} />}</span></div>
              ))}
            </div>
          )}
          <button className="secondary" onClick={() => setView('home')}>← VOLTAR AO MENU</button>
        </main>
      )}

      <footer><span>© 2026 TECTRIS</span><span>SISTEMA DE EVENTO INTERATIVO</span><span>v2.0 WEB</span></footer>
    </div>
  );
}

export default App;