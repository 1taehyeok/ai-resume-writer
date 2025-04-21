# 🧠 AI Resume Writer

AI를 활용해 사용자 맞춤형 자소서를 손쉽게 작성할 수 있는 웹 애플리케이션입니다.  
React + Django 기반의 풀스택 프로젝트로, 효율적이고 직관적인 자소서 작성 경험을 제공합니다.

---

## 📌 프로젝트 개요

### 🔍 프로젝트 목적
- 사용자가 자소서를 쉽게 작성하고, AI를 활용해 기업과 직무에 맞춘 고품질 자소서를 생성하도록 돕는 웹사이트 구축

### 🎯 주요 목표
- 자소서 작성 과정의 복잡성과 시간을 줄임
- 사용자 맞춤형 경험과 AI 기반 피드백으로 경쟁력 있는 자소서 완성
- 다양한 AI 모델 선택과 유료 옵션으로 유연성 제공

### 🎯 타겟 사용자
- 취업 준비생
- 경력자
- 자소서 작성이 어려운 일반인

---

## 🔧 주요 기능

- **사용자 정보 관리**: 로그인 후 기본 정보와 경험 입력/수정/삭제
- **기업 및 직무 조사**: AI로 기업 정보와 직무 요구사항 분석
- **자소서 초안 작성**: 사용자 경험을 문항에 맞게 분류하고 AI로 초안 생성
- **자소서 평가 및 수정**: 일관성, 말투, 분량 등 기준으로 평가 후 개선
- **피드백 반영**: 사용자 피드백을 반복 적용해 최종본 완성
- **추가 기능**: PDF 다운로드, 작성 진행률 표시 등

---

## 🗂️ 폴더 구조

```bash
ai-resume-writer/
│
├── backend/                   # Django 프로젝트
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/                # Django 설정
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── apps/
│       └── core/              # 사용자, 자소서 기능 앱
│           ├── models.py
│           ├── views.py
│           ├── urls.py
│           └── serializers.py
│
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico          # 기본 React favicon (필요 시 추가)
├── src/
│   ├── components/
│   │   ├── Button.js        # 버튼 컴포넌트
│   │   ├── ExperienceForm.js # 경험 입력 폼
│   │   ├── Header.js        # 헤더 (로그인/로그아웃, 네비게이션)
│   │   ├── MappingCard.js   # 매핑 페이지 카드
│   │   ├── PreviewLetter.js # 미리보기 페이지 레터
│   │   ├── ReviewCard.js    # 리뷰 카드
│   │   ├── PrivateRoute.js  # 보호된 경로 컴포넌트
│   ├── context/
│   │   ├── AuthContext.js   # 인증 컨텍스트 (Refresh Token 포함)
│   ├── pages/
│   │   ├── AddExperiencePage.js # 경험 추가 페이지 (테스트 버튼 추가)
│   │   ├── LandingPage.js    # 랜딩 페이지
│   │   ├── LoginPage.js      # 로그인 페이지 (Google OAuth 포함)
│   │   ├── MappingPage.js    # 매핑 페이지
│   │   ├── PreviewPage.js    # 미리보기 페이지
│   │   ├── SignupPage.js     # 회원가입 페이지 (Google OAuth 포함)
│   ├── services/
│   │   ├── auth.js          # 인증 API 함수 (login, googleLogin, refreshToken 등)
│   ├── styles/
│   │   ├── AddExperiencePage.css
│   │   ├── App.css
│   │   ├── Button.css
│   │   ├── Header.css
│   │   ├── LoginPage.css
│   │   ├── SignupPage.css
│   ├── App.js                # 메인 앱 컴포넌트 (Router, GoogleOAuthProvider)
│   ├── index.js             # React 앱 진입점
│   └── index.css            # 글로벌 스타일 (기본 React 제공)
├── .env                     # 환경 변수 (REACT_APP_GOOGLE_CLIENT_ID)
├── package.json             # 의존성 (axios, @react-oauth/google 등)
├── README.md                # 프로젝트 설명 (기본 React 제공)
└── node_modules/            # 설치된 의존성
└── docker-compose.yml         # (선택) Docker로 통합 실행
```

---

## ⚙️ 기술 스택

| 구분     | 사용 기술                          |
|----------|-----------------------------------|
| Frontend | React, Axios, React Router        |
| Backend  | Django, Django REST Framework     |
| AI       | OpenAI API (or other LLMs)        |
| DB       | SQLite (개발) → PostgreSQL (배포) |
| 기타     | Docker, GitHub, CORS 설정 등       |

---

## 🚀 실행 방법

### ✅ Backend

```bash
cd backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

### ✅ Frontend
```bash
cd frontend
npm install
npm start
```
