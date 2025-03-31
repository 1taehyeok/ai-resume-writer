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
├── frontend/                  # React 프로젝트
│   ├── public/
│   ├── src/
│   │   ├── components/        # 공통 컴포넌트
│   │   ├── pages/             # 페이지 단위 컴포넌트
│   │   ├── services/          # API 호출 함수들
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore
├── README.md
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
