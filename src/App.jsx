import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  Brain,
  Palette,
  Users,
  Wrench,
  Search,
  ClipboardList,
  ChevronRight,
  Home,
} from 'lucide-react';

const hollandTypes = {
  R: {
    label: 'Realistic',
    ko: '만들기·움직임형',
    icon: Wrench,
    emoji: '🛠️',
    desc: '손으로 만들고, 움직이고, 실제 물건을 다루는 활동을 좋아해요.',
  },
  I: {
    label: 'Investigative',
    ko: '탐구·분석형',
    icon: Search,
    emoji: '🔎',
    desc: '왜 그런지 궁금해하고, 관찰·실험·문제 해결을 좋아해요.',
  },
  A: {
    label: 'Artistic',
    ko: '상상·표현형',
    icon: Palette,
    emoji: '🎨',
    desc: '그림, 음악, 이야기, 꾸미기처럼 자유롭게 표현하는 활동을 좋아해요.',
  },
  S: {
    label: 'Social',
    ko: '친구·도움형',
    icon: Users,
    emoji: '🤝',
    desc: '친구와 함께하고, 설명하거나 도와주는 활동을 좋아해요.',
  },
  E: {
    label: 'Enterprising',
    ko: '발표·리더형',
    icon: Sparkles,
    emoji: '🎤',
    desc: '앞에서 말하고, 이끌고, 선택을 주도하는 활동을 좋아해요.',
  },
  C: {
    label: 'Conventional',
    ko: '정리·규칙형',
    icon: ClipboardList,
    emoji: '📋',
    desc: '순서, 규칙, 정리, 체크리스트가 있는 활동을 편하게 느껴요.',
  },
};

const activityItems = [
  { id: 1, type: 'R', title: '로봇 조립', emoji: '🤖', sound: '로봇을 직접 조립해 볼래?' },
  { id: 2, type: 'I', title: '곤충 관찰', emoji: '🐞', sound: '작은 곤충을 자세히 관찰해 볼래?' },
  { id: 3, type: 'A', title: '상상 그림', emoji: '🌈', sound: '네 마음속 세상을 그림으로 표현해 볼래?' },
  { id: 4, type: 'S', title: '친구 도와주기', emoji: '🧒', sound: '친구가 어려워하면 도와줄래?' },
  { id: 5, type: 'E', title: '무대 발표', emoji: '🎤', sound: '사람들 앞에서 발표해 볼래?' },
  { id: 6, type: 'C', title: '스티커 정리', emoji: '🗂️', sound: '스티커를 규칙대로 정리해 볼래?' },
  { id: 7, type: 'R', title: '블록 건축', emoji: '🏗️', sound: '블록으로 멋진 건물을 만들어 볼래?' },
  { id: 8, type: 'I', title: '과학 실험', emoji: '🧪', sound: '색이 변하는 실험을 해 볼래?' },
  { id: 9, type: 'A', title: '음악 만들기', emoji: '🎹', sound: '나만의 음악을 만들어 볼래?' },
  { id: 10, type: 'S', title: '팀 놀이', emoji: '⚽', sound: '친구들과 한 팀이 되어 놀아 볼래?' },
  { id: 11, type: 'E', title: '가게 놀이', emoji: '🏪', sound: '가게 주인이 되어 손님을 맞아 볼래?' },
  { id: 12, type: 'C', title: '퍼즐 순서', emoji: '🧩', sound: '퍼즐을 순서대로 맞춰 볼래?' },
];

const htksItems = [
  { command: '머리', correct: '발', icon: '🧠', audio: '머리를 만지라고 하면, 발을 눌러요.' },
  { command: '발', correct: '머리', icon: '🦶', audio: '발을 만지라고 하면, 머리를 눌러요.' },
  { command: '무릎', correct: '어깨', icon: '🦵', audio: '무릎을 만지라고 하면, 어깨를 눌러요.' },
  { command: '어깨', correct: '무릎', icon: '💪', audio: '어깨를 만지라고 하면, 무릎을 눌러요.' },
  { command: '머리', correct: '발', icon: '🧠', audio: '이번에도 반대로 해요. 머리라고 하면 발!' },
  { command: '어깨', correct: '무릎', icon: '💪', audio: '어깨라고 하면 무릎을 눌러요.' },
];

const bodyOptions = [
  { label: '머리', emoji: '🧠' },
  { label: '발', emoji: '🦶' },
  { label: '무릎', emoji: '🦵' },
  { label: '어깨', emoji: '💪' },
];

function speak(text) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function scoreLevel(score, max) {
  const ratio = max === 0 ? 0 : score / max;
  if (ratio >= 0.75) {
    return { label: '안정적', desc: '규칙을 기억하고 반대로 행동하는 힘이 비교적 안정적이에요.' };
  }
  if (ratio >= 0.45) {
    return { label: '보통', desc: '규칙을 이해하지만, 중간중간 짧은 안내와 확인이 도움이 돼요.' };
  }
  return { label: '지원 필요', desc: '짧은 과제, 그림 안내, 반복 연습이 도움이 될 수 있어요.' };
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function PrimaryButton({ children, onClick, disabled = false, className = '' }) {
  return (
    <button className={`btn primary ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick, className = '' }) {
  return (
    <button className={`btn secondary ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [step, setStep] = useState('intro');
  const [selected, setSelected] = useState([]);
  const [htksIndex, setHtksIndex] = useState(0);
  const [htksAnswers, setHtksAnswers] = useState([]);

  const hollandScores = useMemo(() => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    selected.forEach((id) => {
      const item = activityItems.find((x) => x.id === id);
      if (item) scores[item.type] += 1;
    });
    return scores;
  }, [selected]);

  const topTypes = useMemo(() => {
    return Object.entries(hollandScores)
      .sort((a, b) => b[1] - a[1])
      .filter(([, value]) => value > 0)
      .slice(0, 3)
      .map(([key]) => key);
  }, [hollandScores]);

  const htksScore = htksAnswers.reduce((sum, item) => sum + item.score, 0);
  const htksMax = htksItems.length * 2;
  const htksLevel = scoreLevel(htksScore, htksMax);

  const toggleActivity = (item) => {
    speak(item.sound);
    setSelected((prev) => {
      if (prev.includes(item.id)) return prev.filter((id) => id !== item.id);
      if (prev.length >= 6) return prev;
      return [...prev, item.id];
    });
  };

  const answerHtks = (label) => {
    const item = htksItems[htksIndex];
    const score = label === item.correct ? 2 : 0;
    const answer = { command: item.command, correct: item.correct, selected: label, score };
    const next = [...htksAnswers, answer];
    setHtksAnswers(next);

    if (htksIndex + 1 >= htksItems.length) {
      setStep('result');
    } else {
      setHtksIndex(htksIndex + 1);
    }
  };

  const reset = () => {
    window.speechSynthesis?.cancel();
    setStep('intro');
    setSelected([]);
    setHtksIndex(0);
    setHtksAnswers([]);
  };

  return (
    <main className="page">
      <div className="container">
        <header className="header">
          <div>
            <p className="eyebrow">HTKS × Holland Code</p>
            <h1>자녀 성향 분석 놀이터</h1>
            <p className="header-desc">
              아이가 글을 많이 읽지 않아도 그림, 소리, 터치로 흥미와 자기조절 반응을 확인하는 웹 프로토타입입니다.
            </p>
          </div>
          <button className="reset-btn" onClick={reset}>
            <RotateCcw size={18} /> 처음부터
          </button>
        </header>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.section key="intro" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <Card className="intro-card">
                <div className="intro-copy">
                  <div className="hero-icon">🌟</div>
                  <h2>아이 혼자서도 할 수 있는 성향 체크</h2>
                  <p>
                    먼저 좋아하는 활동 그림을 고르고, 다음에는 “반대로 누르기” 게임을 진행합니다. 결과는 진단이 아니라 추천 참고용입니다.
                  </p>
                  <div className="button-row">
                    <PrimaryButton onClick={() => setStep('holland')}>
                      시작하기 <ChevronRight size={20} />
                    </PrimaryButton>
                    <SecondaryButton onClick={() => speak('안녕! 지금부터 그림을 보고 좋아하는 활동을 골라 볼 거야.')}>
                      <Volume2 size={20} /> 소리 안내 듣기
                    </SecondaryButton>
                  </div>
                </div>
                <div className="hero-grid">
                  {['🎨', '🤖', '🔎', '🤝'].map((emoji, index) => (
                    <motion.div key={emoji} className="hero-tile" initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: index * 0.08 }}>
                      {emoji}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.section>
          )}

          {step === 'holland' && (
            <motion.section key="holland" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <div className="section-head">
                <div>
                  <h2>좋아하는 그림을 골라요</h2>
                  <p>최대 6개까지 선택할 수 있어요. 그림을 누르면 소리 안내가 나옵니다.</p>
                </div>
                <div className="pill">선택 {selected.length}/6</div>
              </div>

              <div className="activity-grid">
                {activityItems.map((item) => {
                  const isSelected = selected.includes(item.id);
                  return (
                    <button key={item.id} className={`activity-card ${isSelected ? 'selected' : ''}`} onClick={() => toggleActivity(item)}>
                      <div className="activity-emoji">{item.emoji}</div>
                      <div className="activity-meta">
                        <div>
                          <strong>{item.title}</strong>
                          <span>{hollandTypes[item.type].ko}</span>
                        </div>
                        <Volume2 size={17} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="footer-actions">
                <PrimaryButton disabled={selected.length < 3} onClick={() => { speak('이제 반대로 누르기 게임을 시작할게요.'); setStep('htks'); }}>
                  다음 게임으로 <ChevronRight size={20} />
                </PrimaryButton>
              </div>
            </motion.section>
          )}

          {step === 'htks' && (
            <motion.section key="htks" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <Card className="game-card">
                <div className="section-head">
                  <div>
                    <h2>반대로 누르기 게임</h2>
                    <p>말한 곳을 그대로 누르지 말고, 짝이 되는 반대 버튼을 눌러요.</p>
                  </div>
                  <div className="pill">{htksIndex + 1}/{htksItems.length}</div>
                </div>

                <div className="command-box">
                  <div className="command-icon">{htksItems[htksIndex].icon}</div>
                  <p>지시</p>
                  <h3>“{htksItems[htksIndex].command}”</h3>
                  <SecondaryButton onClick={() => speak(htksItems[htksIndex].audio)}>
                    <Volume2 size={20} /> 안내 듣기
                  </SecondaryButton>
                </div>

                <div className="body-grid">
                  {bodyOptions.map((option) => (
                    <button key={option.label} className="body-card" onClick={() => answerHtks(option.label)}>
                      <div>{option.emoji}</div>
                      <strong>{option.label}</strong>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.section>
          )}

          {step === 'result' && (
            <motion.section key="result" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}>
              <Card className="result-title">
                <div className="result-icon"><Brain size={30} /></div>
                <div>
                  <h2>분석 결과</h2>
                  <p>진단이 아닌, 활동 추천을 위한 참고 결과입니다.</p>
                </div>
              </Card>

              <div className="result-grid">
                <Card className="interest-card">
                  <h3>흥미 성향 Top 3</h3>
                  <div className="top-grid">
                    {(topTypes.length ? topTypes : ['A', 'I', 'S']).map((type) => {
                      const info = hollandTypes[type];
                      const Icon = info.icon;
                      return (
                        <div key={type} className="type-card">
                          <div className="type-head">
                            <span>{info.emoji}</span>
                            <Icon size={21} />
                          </div>
                          <p>{info.label}</p>
                          <h4>{info.ko}</h4>
                          <small>{info.desc}</small>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card className="score-card">
                  <h3>자기조절 게임 점수</h3>
                  <div className="score-number">
                    {htksScore}<span>/{htksMax}</span>
                  </div>
                  <div className="score-label">{htksLevel.label}</div>
                  <p>{htksLevel.desc}</p>
                </Card>
              </div>

              <Card className="recommend-card">
                <h3>추천 학습 방식</h3>
                <div className="recommend-grid">
                  <div>
                    <h4>활동 추천</h4>
                    <p>상위 흥미 유형과 연결된 만들기, 탐구, 표현, 협동 활동을 짧은 프로젝트 형태로 제공하세요.</p>
                  </div>
                  <div>
                    <h4>공간 추천</h4>
                    <p>시각 자료가 잘 보이는 벽면, 선택 가능한 활동 바구니, 완료 체크 보드를 함께 두면 좋아요.</p>
                  </div>
                  <div>
                    <h4>진행 팁</h4>
                    <p>자기조절 점수가 낮을수록 긴 설명보다 그림 규칙, 짧은 미션, 즉시 칭찬이 효과적입니다.</p>
                  </div>
                </div>
              </Card>

              <div className="footer-actions between">
                <SecondaryButton onClick={() => setStep('intro')}>
                  <Home size={20} /> 홈으로
                </SecondaryButton>
                <PrimaryButton onClick={reset}>
                  다시 검사하기 <RotateCcw size={20} />
                </PrimaryButton>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
