# AI Resume Writer - Backend

Django 기반의 백엔드 서버입니다.

## 기술 스택
- Python 3.x
- Django 4.2.20
- Django REST Framework 3.14.0
- Django CORS Headers 4.3.1

## 설치 및 실행

1. 가상환경 생성 및 활성화
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 의존성 설치
```bash
pip install -r requirements.txt
```

3. 데이터베이스 마이그레이션
```bash
python manage.py migrate
```

4. 개발 서버 실행
```bash
python manage.py runserver
```

서버는 기본적으로 http://127.0.0.1:8000 에서 실행됩니다.

## API 엔드포인트

- GET `/api/test/`: 테스트 API 엔드포인트
