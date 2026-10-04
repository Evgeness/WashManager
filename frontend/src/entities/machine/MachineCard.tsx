// ===== ИМПОРТЫ =====
import { Card, CardContent, Typography, Stack, Divider, Button } from '@mui/material';
import type { MachineStatus } from './types';
// import type — потому что MachineStatus используется только для типизации.
// Vite удалит этот импорт при сборке.

import { timeSlots } from '../../shared/api/mockApi';
// timeSlots — массив временных слотов из единого источника данных


// ===== ТИП ПРОПСОВ КОМПОНЕНТА =====
interface Props {
  machine: { id: number; name: string };  // какая машина
  day: number;                            // индекс выбранного дня (0 = сегодня)
  selectedSlot: { machineId: number; time: string } | null;  // выбранный слот
  onSlotClick: (machineId: number, time: string, status: string) => void;  // callback
}


// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (чистые) =====

/**
 * Определяет статус конкретного слота.
 * Демонстрационная логика: для «сегодня» некоторые слоты жёстко захардкожены.
 * В реальном приложении статус приходил бы с backend.
 */
const getStatus = (machineId: number, time: string, day: number): MachineStatus => {
  if (day === 0) {
    if (machineId === 1 && time === '10:00-12:00') return 'busy';    // занято
    if (machineId === 1 && time === '12:00-14:00') return 'queued';  // очередь
    if (machineId === 2 && time === '08:00-10:00') return 'busy';
    if (machineId === 3 && time === '18:00-20:00') return 'busy';
  }
  return 'free';  // по умолчанию — свободно
};


/**
 * Переводит статус в цвет MUI.
 * Возвращает ключ из palette темы: error (красный) / warning (жёлтый) / success (зелёный).
 * Union-тип возвращаемого значения нужен для корректной работы с MUI Button color.
 */
const getStatusColor = (status: MachineStatus): 'error' | 'warning' | 'success' => {
  switch (status) {
    case 'busy':   return 'error';
    case 'queued': return 'warning';
    default:       return 'success';
  }
};


/**
 * Переводит статус в русский текст для подписи под временем.
 */
const getStatusLabel = (status: MachineStatus): string => {
  switch (status) {
    case 'busy':   return 'Занято';
    case 'queued': return 'Очередь';
    case 'broken': return 'Сломано';  // заложено на будущее
    default:       return 'Свободно';
  }
};


// ===== ОСНОВНОЙ КОМПОНЕНТ =====
export default function MachineCard({ machine, day, selectedSlot, onSlotClick }: Props) {
  return (
    // Карточка машины — со стилями из темы (bg background.paper, border 1px solid #0f6bec)
    <Card>
      <CardContent>
        {/* ===== ЗАГОЛОВОК: название машины ===== */}
        <Typography variant="h3" sx={{ mb: 2 }}>
          {machine.name}
        </Typography>

        {/* Горизонтальный разделитель */}
        <Divider sx={{ mb: 2 }} />

        {/* ===== СЕТКА СЛОТОВ =====
            direction="row"       — горизонтальная раскладка
            spacing={1}            — отступ 8px между кнопками
            flexWrap: 'wrap'       — перенос на новую строку, если не помещаются
            useFlexGap             — использует CSS-gap вместо margin (корректный перенос)
        */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }} useFlexGap>
          {timeSlots.map((time) => {
            // Определяем статус ЭТОГО слота (занято/очередь/свободно)
            const status = getStatus(machine.id, time, day);

            // Проверяем: выбран ли ЭТОТ слот сейчас?
            // Optional chaining (?.) защищает от ошибки, если selectedSlot === null
            const isSelected =
              selectedSlot?.machineId === machine.id && selectedSlot?.time === time;

            return (
              <Button
                key={time}   // уникальный key для React (обязателен в .map)

                // Свободные — с обводкой (outlined), занятые — с заливкой (contained)
                variant={status === 'free' ? 'outlined' : 'contained'}

                // Цвет из палитры темы
                color={getStatusColor(status)}

                // При клике вызываем callback из родителя с параметрами этого слота.
                // Замыкание «запоминает» machine.id, time, status.
                onClick={() => onSlotClick(machine.id, time, status)}

                sx={{
                  flexDirection: 'column',   // текст внутри кнопки — в столбик
                  py: 1,                     // вертикальный отступ
                  minWidth: 110,             // минимальная ширина, чтобы кнопки не сжимались
                  border: isSelected ? '2px solid #fff' : undefined,  // подсветка выбора
                }}
              >
                {/* Верхняя строка: время начала (например, "08:00" из "08:00-10:00") */}
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {time.split('-')[0]}
                </Typography>

                {/* Нижняя строка: статус (Свободно / Занято / Очередь) */}
                <Typography variant="caption">
                  {getStatusLabel(status)}
                </Typography>
              </Button>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}