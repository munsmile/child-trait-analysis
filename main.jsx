import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RotateCcw, Sparkles, Brain, Palette, Users, Wrench, Search, ClipboardList } from 'lucide-react';
import './styles.css';

const hollandTypes = {
  R: { label: 'Realistic', ko: '만들기·움직임형', icon: Wrench, emoji: '🛠️', desc: '손으로 만들고, 움직이고, 실제 물건을 다루는 활동을 좋아해요.' },
  I: { label: 'Investigative', ko: '탐구·분석형', icon: Search, emoji: '🔎', desc: '왜 그런지 궁금해하고, 관찰·실험·문제 해결을 좋아해요.' },
  A: { label: 'Artistic', ko: '상상·표현형', icon: Palette, emoji: '🎨', desc: '그림, 음악, 이야기, 꾸미기처럼 자유롭게 표현하는 활동을 좋아해요.' },
  S: { label: 'Social', ko: '친구·도움형', icon: Users, emoji: '🤝', desc: '친구와 함께하고, 설명하거나 도와주는 활동을 좋아해요.' },
  E: { label: 'Enterprising', ko: '발표·리더형', icon: Sparkles, emoji: '🎤', desc: '앞에서 말하고, 이끌고, 선택을 주도하는 활동을 좋아해요.' },
  C: { label: 'Conventional', ko: '정리·규칙형', icon: ClipboardList, emoji: '📋', desc: '순서, 규칙, 정리, 체크리스트가 있는 활동을 편하게 느껴요.' },
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
  { label: '머리', emoji: '🧠' }, { label: '발', emoji: '🦶' }, { label: '무릎', emoji: '🦵' }, { label: '어깨', emoji: '💪' },
];

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
}

function scoreLevel(score, max) {
  const ratio = max === 0 ? 0 : score / max;
  if (ratio >= 0.75) return { label: '안정적', desc: '규칙을 기억하고 반대로 행동하는 힘이 비교적 안정적이에요.' };
  if (ratio >= 0.45) return { label: '보통', desc: '규칙을 이해하지만, 중간중간 짧은 안내와 확인이 도움이 돼요.' };
  return { label: '지원 필요', desc: '짧은 과제, 그림 안내, 반복 연습이 도움이 될 수 있어요.' };
}

function App() {
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

  const topTypes = useMemo(() => Object.entries(hollandScores).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0).slice(0, 3).map(([key]) => key), [hollandScores]);
  const htksScore = htksAnswers.reduce((sum, item) => sum + item.score, 0);
  const htksMax = htksItems.length * 2;
  const htksLevel = scoreLevel(htksScore, htksMax);

  const toggleActivity = (item) => {
    speak(item.sound);
    setSelected((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : prev.length >= 6 ? prev : [...prev, item.id]);
  };

  const answerHtks = (label) => {
    const item = htksItems[htksIndex];
    const score = label === item.correct ? 2 : 0;
    const next = [...htksAnswers, { command: item.command, correct: item.correct, selected: label, score }];
    setHtksAnswers(next);
    if (htksIndex + 1 >= htksItems.length) setStep('result');
    else setHtksIndex(htksIndex + 1);
  };

  const reset = () => {
    window.speechSynthesis?.cancel();
    setStep('intro'); setSelected([]); setHtksIndex(0); setHtksAnswers([]);
  };

  return <div className="page"><div className="wrap">
    <header className="header"><div><p className="eyebrow">HTKS × Holland Code</p><h1>자녀 성향 분석 놀이터</h1><p>아이 스스로 그림, 소리, 터치로 흥미와 자기조절 반응을 확인하는 웹 프로토타입입니다.</p></div><button className="btn ghost" onClick={reset}><RotateCcw size={18}/> 처음부터</button></header>
    <AnimatePresence mode="wait">
      {step === 'intro' && <motion.section key="intro" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className="hero card"><div><div className="badge">🌟</div><h2>아이 혼자서도 할 수 있는 성향 체크</h2><p>먼저 좋아하는 활동 그림을 고르고, 다음에는 “반대로 누르기” 게임을 진행합니다. 결과는 진단이 아니라 추천 참고용입니다.</p><div className="actions"><button className="btn primary" onClick={() => setStep('holland')}>시작하기</button><button className="btn soft" onClick={() => speak('안녕! 지금부터 그림을 보고 좋아하는 활동을 골라 볼 거야.')}><Volume2 size={20}/> 소리 안내 듣기</button></div></div><div className="hero-art">{['🎨','🤖','🔎','🤝'].map((e) => <div className="tile" key={e}>{e}</div>)}</div></motion.section>}
      {step === 'holland' && <motion.section key="holland" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="section-title"><div><h2>좋아하는 그림을 골라요</h2><p>최대 6개까지 선택할 수 있어요. 그림을 누르면 소리 안내가 나옵니다.</p></div><span>선택 {selected.length}/6</span></div><div className="grid">{activityItems.map((item) => <button key={item.id} onClick={() => toggleActivity(item)} className={`activity ${selected.includes(item.id) ? 'on' : ''}`}><div className="emoji">{item.emoji}</div><div className="activity-foot"><div><b>{item.title}</b><small>{hollandTypes[item.type].ko}</small></div><Volume2 size={16}/></div></button>)}</div><div className="next"><button disabled={selected.length < 3} className="btn primary" onClick={() => {speak('이제 반대로 누르기 게임을 시작할게요.'); setStep('htks');}}>다음 게임으로</button></div></motion.section>}
      {step === 'htks' && <motion.section key="htks" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} className="card htks"><div className="section-title"><div><h2>반대로 누르기 게임</h2><p>말한 곳을 그대로 누르지 말고, 짝이 되는 반대 버튼을 눌러요.</p></div><span>{htksIndex + 1}/{htksItems.length}</span></div><div className="command"><div>{htksItems[htksIndex].icon}</div><small>지시</small><h3>“{htksItems[htksIndex].command}”</h3><button className="btn soft" onClick={() => speak(htksItems[htksIndex].audio)}><Volume2 size={20}/> 안내 듣기</button></div><div className="body-grid">{bodyOptions.map((option) => <button key={option.label} onClick={() => answerHtks(option.label)}><span>{option.emoji}</span><b>{option.label}</b></button>)}</div></motion.section>}
      {step === 'result' && <motion.section key="result" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}><div className="result-head card"><Brain/><div><h2>분석 결과</h2><p>진단이 아닌, 활동 추천을 위한 참고 결과입니다.</p></div></div><div className="result-grid"><div className="card wide"><h3>흥미 성향 Top 3</h3><div className="type-grid">{(topTypes.length ? topTypes : ['A','I','S']).map((type) => { const info = hollandTypes[type]; const Icon = info.icon; return <div className="type-card" key={type}><div><span>{info.emoji}</span><Icon size={22}/></div><small>{info.label}</small><h4>{info.ko}</h4><p>{info.desc}</p></div>; })}</div></div><div className="card score"><h3>자기조절 게임 점수</h3><strong>{htksScore}<em>/{htksMax}</em></strong><span>{htksLevel.label}</span><p>{htksLevel.desc}</p></div></div><div className="card recommend"><h3>추천 학습 방식</h3><div className="type-grid"><div><h4>활동 추천</h4><p>상위 흥미 유형과 연결된 만들기, 탐구, 표현, 협동 활동을 짧은 프로젝트 형태로 제공하세요.</p></div><div><h4>공간 추천</h4><p>시각 자료가 잘 보이는 벽면, 선택 가능한 활동 바구니, 완료 체크 보드를 함께 두면 좋아요.</p></div><div><h4>진행 팁</h4><p>자기조절 점수가 낮을수록 긴 설명보다 그림 규칙, 짧은 미션, 즉시 칭찬이 효과적입니다.</p></div></div></div></motion.section>}
    </AnimatePresence>
  </div></div>;
}

createRoot(document.getElementById('root')).render(<App />);
