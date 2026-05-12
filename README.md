# 자녀 성향 분석 놀이터

HTKS 방식의 자기조절 게임과 Holland Code 기반 흥미 선택을 조합한 웹 프로토타입입니다.

> 주의: 이 프로젝트는 공식 진단 도구가 아니라 추천/프로토타입 용도입니다. 공식 HTKS 사용은 권한 및 라이선스를 확인해야 합니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## GitHub 업로드

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_ID/child-trait-analysis.git
git push -u origin main
```

## GitHub Pages 배포

1. `package.json`의 `homepage` 값을 본인 GitHub ID로 변경합니다.

```json
"homepage": "https://YOUR_GITHUB_ID.github.io/child-trait-analysis"
```

2. 배포 실행

```bash
npm run deploy
```

3. GitHub 저장소 Settings > Pages에서 `gh-pages` 브랜치를 선택합니다.
