# Child Trait Analysis Web App

HTKS 방식의 자기조절 게임과 Holland Code 기반 흥미 선택을 조합한 자녀 성향 분석 웹 프로토타입입니다.

> 주의: 이 프로젝트는 공식 진단도구가 아니라 추천/프로토타입 목적입니다. HTKS 및 Holland Code 기반 도구를 상업적으로 사용하려면 별도 라이선스와 윤리 검토가 필요할 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## GitHub Pages 배포

1. `package.json`의 homepage를 본인 GitHub 주소로 변경합니다.

```json
"homepage": "https://YOUR_GITHUB_ID.github.io/YOUR_REPOSITORY_NAME"
```

2. GitHub 저장소에 업로드합니다.

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_ID/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

3. 배포합니다.

```bash
npm run build
npm run deploy
```

4. GitHub 저장소의 `Settings > Pages`에서 `gh-pages` 브랜치를 선택합니다.
