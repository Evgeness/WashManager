# WashManager Backend

## Модель данных

Приложение использует **три сущности**:

### Machine (Стиральная/сушильная машина)
| Поле | Тип | Описание |
|---|---|---|
| id | Integer | PK, автоинкремент |
| name | String(100) | Название машины |
| type | Enum | `washer` или `dryer` |
| status | String(20) | `free`, `busy`, `broken` |

### Booking (Бронь)
| Поле | Тип | Описание |
|---|---|---|
| id | Integer | PK |
| user_name | String(100) | ФИО бронирующего |
| user_room | String(20) | Номер комнаты |
| machine_id | FK → machines.id | Какая машина |
| start_time | DateTime | Начало |
| end_time | DateTime | Конец |
| status | String(20) | `active`, `queued`, `completed` |

### Связи
- **Machine → Booking**: One-to-Many (`machine.bookings`, `booking.machine`)
- Удаление машины каскадно удаляет её брони (`cascade="all, delete-orphan"`)

## Настройка окружения

1. Установите PostgreSQL и создайте БД:
   ```sql
   CREATE DATABASE washmanager;