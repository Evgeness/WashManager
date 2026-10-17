markdown

# WashManager

> Приложение для бронирования стиральных и сушильных машин в общежитии.

Состоит из двух частей:
- **Frontend** — React + TypeScript + MUI
- **Backend** — FastAPI + PostgreSQL + SQLAlchemy

---

## 🎯 Назначение приложения

**WashManager** — веб-приложение для студентов общежития, которое позволяет:

- просматривать актуальное состояние стиральных и сушильных машин;
- бронировать свободные временные слоты;
- вставать в очередь на занятые слоты;
- получать напоминания о завершении стирки;
- вести историю своих бронирований.

---

## 👤 Пользовательские сценарии

1. **Регистрация** — пользователь создаёт аккаунт (ФИО, комната, email, пароль).
2. **Вход** — пользователь входит по email и паролю, получает JWT-токены.
3. **Просмотр главной страницы** — видит ближайшую *свою* бронь и общую статистику свободных слотов (с авто-обновлением).
4. **Просмотр расписания** — выбирает день и видит реальные статусы всех машин по слотам (свободно / занято / очередь).
5. **Бронирование слота** — кликает на свободный слот и подтверждает бронирование. Данные сохраняются в PostgreSQL.
6. **Очередь** — если слот занят, пользователь может встать в очередь. Если активная бронь отменяется, первый в очереди автоматически получает этот слот (каскадное продвижение).
7. **Просмотр своих броней** — видит только свои активные брони и историю (с авто-обновлением).
8. **Отмена брони** — может отменить только свою бронь.
9. **Выход** — очистка сессии и отзыв refresh-токена на сервере.

---

## 🖼 Основные экраны

| Экран | Маршрут | Назначение | Защита |
|---|---|---|---|
| **Dashboard** | `/` | Главная. Две карточки: ближайшая бронь и свободные слоты. | 🔒 Приватный |
| **Schedule** | `/schedule` | Расписание. Вкладки по дням, список машин, слоты. | 🔒 Приватный |
| **MyBookings** | `/my-bookings` | Мои брони. Вкладки «Активные» / «История». | 🔒 Приватный |
| **Login** | `/login` | Вход в аккаунт. | ✅ Публичный |
| **Register** | `/register` | Регистрация. | ✅ Публичный |

---

## 🔐 Аутентификация и авторизация

### Схема работы

1. **Регистрация** (`POST /auth/register`) — пароль хэшируется через **bcrypt** и сохраняется в БД.
2. **Вход** (`POST /auth/login`) — сервер проверяет пароль и выдаёт **два токена**:
   - **access_token** (JWT, 30 минут) — для доступа к API
   - **refresh_token** (7 дней) — для обновления access
3. **Refresh-токен сохраняется в БД** — это позволяет его **отзывать** при logout.
4. **Защищённые запросы** — требуют заголовок `Authorization: Bearer <access>`.
5. **Авто-обновление** — при истечении access фронт автоматически вызывает `POST /auth/refresh`.
6. **Выход** (`POST /auth/logout`) — refresh помечается как `revoked = true` в БД.

### Безопасность

- **Пароли** хэшируются bcrypt с автоматической солью. Одинаковые пароли дают **разные хэши**.
- **JWT** подписаны `SECRET_KEY` (алгоритм HS256). Подделать без ключа невозможно.
- **`type` в payload** (`access` / `refresh`) — защищает от подмены refresh на access.
- **Refresh Token Rotation** — при обновлении старый refresh отзывается, выдаётся новый (защита от replay-атак).
- **Проверка владельца** — при удалении чужой брони возвращается **403 Forbidden**.
- **`user_id` не принимается от клиента** — подставляется из токена при создании брони.

### Эндпоинты аутентификации

| Метод | URL | Назначение | Требует токен |
|---|---|---|---|
| GET | `/bookings/` | Список **своих** броней | ✅ access |
| GET | `/bookings/all` | Список **всех** броней (для расписания) | ✅ access |
| POST | `/bookings/` | Создать бронь (авто-определение статуса `active` или `queued`) | ✅ access |
| DELETE | `/bookings/{id}` | Удалить бронь (с автоматическим продвижением очереди) | ✅ access |

### Защита остальных маршрутов

| Метод | URL | Доступ |
|---|---|---|
| GET `/machines/` | Список машин | ✅ Публичный |
| GET `/machines/{id}` | Машина по ID | ✅ Публичный |
| POST/PATCH/DELETE `/machines/` | Изменение машин | 🔒 Только авторизованные |
| GET `/bookings/` | Список броней | 🔒 Только **свои** |
| POST `/bookings/` | Создать бронь | 🔒 Авторизованные |
| PATCH/DELETE `/bookings/{id}` | Изменить/удалить | 🔒 Только **владелец** (иначе 403) |

### HTTP-статусы

| Код | Значение |
|---|---|
| 200 OK | Успешный запрос |
| 201 Created | Создано |
| 204 No Content | Успешное удаление |
| 401 Unauthorized | Нет или невалидный токен |
| 403 Forbidden | Авторизован, но нет прав |
| 404 Not Found | Не найдено |
| 409 Conflict | Email уже занят |
| 422 Unprocessable Entity | Ошибка валидации |

---

## 🏗 Архитектура Backend

```
backend/app/
├── api/
│   ├── deps.py              # Зависимости: get_db, get_current_user
│   └── routes/
│       ├── auth.py          # Регистрация, login, refresh, logout, me
│       ├── machines.py      # CRUD машин
│       └── bookings.py      # CRUD броней (только свои)
├── core/
│   ├── config.py            # Настройки из .env (JWT, БД)
│   └── security.py          # bcrypt + JWT (encode/decode)
├── crud/
│   ├── user.py              # Работа с User
│   ├── refresh_token.py     # Работа с RefreshToken
│   ├── machine.py
│   └── booking.py
├── db/
│   ├── base.py              # DeclarativeBase
│   └── session.py           # Engine + SessionLocal
├── models/
│   ├── user.py              # User (id, full_name, room, email, hashed_password)
│   ├── refresh_token.py     # RefreshToken (token, user_id, revoked)
│   ├── machine.py
│   └── booking.py           # + user_id (FK)
├── schemas/
│   ├── auth.py              # RegisterRequest, LoginRequest, TokenResponse
│   ├── machine.py
│   └── booking.py
└── main.py                  # FastAPI + CORS + include_router
```


## 🗄 Модель данных

```
User (users)                       Booking (bookings)
─────────────────                  ──────────────────
id (PK)                            id (PK)
full_name                          machine_id (FK → machines.id)
room                               user_id (FK → users.id)   ← ЛР №4
email (UNIQUE)                     start_time
hashed_password                    end_time
                                   status
bookings: list[Booking]  ◄───────► user: User
                                   machine: Machine

RefreshToken (refresh_tokens)
─────────────────────────────
id (PK)
token (UNIQUE)
user_id (FK → users.id)
expires_at
revoked
```

**Связи:**
- `User` → `Booking` — One-to-Many (`user.bookings`, `booking.user`)
- `Machine` → `Booking` — One-to-Many (`machine.bookings`, `booking.machine`)
- `User` → `RefreshToken` — One-to-Many (для возможности отзыва)

## 🏗 Архитектура Frontend (FSD-lite)

```
    src/
    ├── app/ # Настройка приложения (тема)
    │ └── theme.ts
    ├── pages/ # Страницы
    │ ├── Dashboard.tsx # ← авто-обновление, реальная статистика
    │ ├── Schedule.tsx # ← реальные брони, авто-обновление
    │ ├── MyBookings.tsx # ← реальные брони, авто-обновление
    │ ├── Login.tsx
    │ └── Register.tsx
    ├── features/ # Пользовательские действия
    │ └── booking-machine/ # Окно подтверждения (с логикой очереди)
    ├── entities/ # Сущности предметной области
    │ ├── machine/
    │ │ ├── types.ts
    │ │ └── MachineCard.tsx # ← отображает слоты и очередь
    │ └── booking/
    │ └── types.ts
    └── shared/ # Общие модули
    ├── api/
    │ ├── client.ts # fetch + авто-обновление токена
    │ ├── authApi.ts # login / register / logout / me
    │ ├── machineApi.ts # ← запросы к /machines/
    │ └── bookingApi.ts # ← запросы к /bookings/ (включая /all)
    ├── context/
    │ └── AuthContext.tsx # Глобальное состояние пользователя
    └── ui/
    ├── Layout.tsx
    ├── Loader.tsx
    ├── EmptyState.tsx
    └── ProtectedRoute.tsx
```

**Принцип FSD:** каждый слой знает только о слоях ниже — `pages` → `features` → `entities` → `shared`.

## 🎛 Состояния экранов

Каждая страница с данными поддерживает **четыре состояния**:

| Состояние | Что показывается | Компонент |
|---|---|---|
| **Loading** | Спиннер «Загрузка данных...» | `Loader` |
| **Error** | Красный `Alert` + заглушка | `Alert` + `EmptyState` |
| **Empty** | Иконка + текст-заглушка | `EmptyState` |
| **Success** | Основные данные с анимацией | `Fade` |

---

## 🎬 Анимации и переходы

- **`Fade`** — плавное появление списков и карточек
- **`Grow`** — открытие форм Login и Register
- **`Dialog`** — модальное окно подтверждения брони

---

## 🔄 Синхронизация и Очередь

В рамках пятой лабораторной работы приложение было полностью интегрировано с базой данных PostgreSQL.

### Отказ от Mock-данных
Файл `mockApi.ts` был удален. Все данные теперь получаются через реальные HTTP-запросы к FastAPI (`machineApi`, `bookingApi`). Форматы дат синхронизированы с Pydantic (ISO 8601), а в ответах бэкенда подтягивается `machine_name` через SQLAlchemy relationships.

### Логика очереди (Cascade Promotion)
1. При создании брони бэкенд проверяет, есть ли на этот слот активная бронь.
2. Если слот свободен — создается бронь со статусом `active`.
3. Если занят — создается бронь со статусом `queued`.
4. **Каскадное продвижение:** если пользователь отменяет активную бронь (`DELETE /bookings/{id}`), бэкенд автоматически находит первого человека в очереди (`status = 'queued'`, сортировка по `id`) и меняет его статус на `active`.

### Авто-обновление интерфейса (Polling)
Для отображения актуального состояния (например, когда другой пользователь отменил бронь и ваша очередь подошла) используется `setInterval`. 
Компоненты `Dashboard`, `Schedule` и `MyBookings` каждые 5 секунд отправляют "тихие" (без лоадера) запросы на сервер для получения свежих данных.

### Обработка ошибок API
- Если пользователь пытается дважды забронировать один и тот же слот, бэкенд возвращает `400 Bad Request`.
- Фронтенд перехватывает эту ошибку и отображает красный `Alert` внутри `BookingForm`.
- Уведомления об успешных действиях (бронь, отмена) теперь выводятся через компонент `Snackbar`, а не через стандартный `alert()`.

---
## ✅ Валидация форм

### Register
- **ФИО** — минимум имя и фамилия
- **Номер комнаты** — только цифры, максимум 4 символа (фильтрация при вводе)
- **Email** — формат через регулярное выражение
- **Пароль** — минимум 6 символов
- **Подтверждение пароля** — совпадение с введённым

### Login
- **Email** — формат
- **Пароль** — минимум 6 символов
- **Серверная валидация** — Alert с ошибкой от backend (401 — неверные credentials)

---

## 🔄 Поток данных

### Регистрация → Автологин → Dashboard

Форма регистрации
↓
POST /auth/register → User создан, пароль захэширован
↓
POST /auth/login → access + refresh токены
↓
GET /auth/me → данные пользователя
↓
setUser() в контексте
↓
navigate('/') → ProtectedRoute пропускает
text


### Авто-обновление токена

Запрос с истёкшим access
↓
Backend отвечает 401
↓
client.ts вызывает POST /auth/refresh
↓
Backend: проверяет refresh, отзывает старый,
выдаёт новый access + refresh
↓
Исходный запрос повторяется с новым токеном
text


### Выход

Клик «Выйти»
↓
POST /auth/logout с refresh_token
↓
Backend: refresh.revoked = true
↓
clearTokens() — токены удалены из памяти
↓
setUser(null) в контексте
↓
navigate('/login')
text


---

## 🚀 Инструкция запуска

### Требования

- **Node.js** 18+, **npm** 9+
- **Python** 3.12
- **PostgreSQL** 15+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Приложение: **http://localhost:5173**

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Swagger UI: **http://127.0.0.1:8000/docs**

### Переменные окружения (`backend/.env`)

```env
DATABASE_URL=postgresql://postgres:1234@localhost:3000/washmanager
SECRET_KEY=<случайная строка 64+ символа>
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

Генерация `SECRET_KEY`:

```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

## 🛠 Стек технологий

### Frontend

- **React 18** — библиотека для интерфейсов
- **TypeScript** — статическая типизация
- **Vite** — сборщик и dev-сервер
- **React Router v6** — клиентская маршрутизация
- **MUI (Material UI) v6** — UI-компоненты
- **MUI Icons** — набор иконок

### Backend

- **FastAPI** — веб-фреймворк
- **Uvicorn** — ASGI-сервер
- **PostgreSQL** — БД
- **SQLAlchemy 2.0** — ORM
- **Pydantic** — валидация данных
- **Pydantic Settings** — конфигурация из `.env`
- **python-jose** — JWT-токены
- **passlib[bcrypt]** — хэширование паролей
- **email-validator** — валидация email

### Единое оформление

Все компоненты используют общую тему `src/app/theme.ts`:

- 🌙 **Тёмная тема** (`mode: 'dark'`)
- 🎨 **Палитра:** синий (`primary`), голубой (`secondary`), зелёный (`success`), жёлтый (`warning`), красный (`error`)
- 📐 **Скруглённые углы:** `borderRadius: 10` / `14` для карточек
- 🔤 **Шрифт Inter**
- 📱 **Адаптивность:** сетки `xs` / `md`, `Container maxWidth={false}`



### Интеграция Frontend и Backend (MVP)
- **Удален `mockApi.ts`** — все данные теперь тянутся из PostgreSQL через FastAPI.
- **Синхронизация типов:** фронтенд отправляет ISO-даты, бэкенд возвращает `machine_name`.
- **Реальный CRUD:** создание и удаление броней работают с базой данных.
- **Логика очереди:** при отмене активной брони следующий пользователь из очереди автоматически становится активным (Cascade Promotion).
- **Авто-обновление (Polling):** экраны Dashboard, Schedule и MyBookings обновляют данные каждые 5 секунд без перезагрузки страницы.
- **UI-улучшения:** вместо `alert()` используются `Snackbar` (успех) и `Alert` внутри модалок (ошибки). 
- **Отображение очереди:** в расписании слоты с очередью подсвечиваются желтым с указанием количества человек `Очередь (N)`.
- **Дашборд:** статистика теперь считает *общие* брони, а карточка "Ближайшая бронь" фильтрует их по `user_id` текущего пользователя.