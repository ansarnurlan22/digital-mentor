'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Award,
  User,
  Shield,
  LogOut,
  Bell,
  MessageSquare,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  ArrowRight,
  Search,
  Bookmark,
  ChevronRight,
  RefreshCw,
  Video,
  Clock,
  Zap,
  Users,
  Star,
  ExternalLink,
  Flame,
  CheckCheck,
  Cpu,
  GraduationCap
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonModule {
  topic: string;
  category: string;
  tag: string;
  theoryPoints: string[];
  keyFormulaOrCode: {
    title: string;
    content: string;
    note: string;
  };
  quiz: QuizQuestion[];
  mentFeedback: {
    title: string;
    summary: string;
    masteryTip: string;
    bonusTask: string;
  };
}

// ============================================================================
// Pre-Baked Rich Ment AI Lessons (Instant Interactive Engine)
// ============================================================================

const PRESET_LESSONS: Record<string, LessonModule> = {
  'Теорема Виета': {
    topic: 'Теорема Виета',
    category: 'Алгебра & SAT Math',
    tag: 'Квадратные уравнения',
    theoryPoints: [
      'Теорема Виета связывает корни квадратного уравнения ax² + bx + c = 0 с его коэффициентами без необходимости вычисления дискриминанта.',
      'Для приведенного уравнения x² + px + q = 0 сумма корней равна второму коэффициенту с противоположным знаком: x₁ + x₂ = -p.',
      'Произведение корней приведенного квадратного уравнения строго равно свободному члену: x₁ · x₂ = q.',
      'Если уравнение не приведено (a ≠ 1), коэффициенты сначала делятся на a: x₁ + x₂ = -b/a, а x₁ · x₂ = c/a.'
    ],
    keyFormulaOrCode: {
      title: 'Ключевые соотношения Виета',
      content: 'Для x² + px + q = 0:\n  x₁ + x₂ = -p\n  x₁ · x₂ = q\n\nДля ax² + bx + c = 0:\n  x₁ + x₂ = -b / a\n  x₁ · x₂ = c / a',
      note: 'Лайфхак для СОР/СОЧ: если a + b + c = 0, то x₁ = 1, x₂ = c/a.'
    },
    quiz: [
      {
        id: 1,
        question: 'Чему равна сумма корней уравнения x² - 7x + 12 = 0?',
        options: ['7', '-7', '12', '-12'],
        correctIndex: 0,
        explanation: 'Для x² + px + q = 0 сумма корней x₁ + x₂ = -p. Здесь p = -7, следовательно x₁ + x₂ = -(-7) = 7.'
      },
      {
        id: 2,
        question: 'Чему равно произведение корней уравнения 2x² + 8x - 10 = 0?',
        options: ['-5', '5', '-10', '-4'],
        correctIndex: 0,
        explanation: 'Уравнение не приведенное (a = 2, c = -10). Произведение x₁ · x₂ = c/a = -10 / 2 = -5.'
      },
      {
        id: 3,
        question: 'Найдите корни уравнения x² - 5x + 6 = 0 подбором по Виету:',
        options: ['x₁ = 2, x₂ = 3', 'x₁ = -2, x₂ = -3', 'x₁ = 1, x₂ = 6', 'x₁ = -1, x₂ = 5'],
        correctIndex: 0,
        explanation: 'Сумма 2 + 3 = 5 (-p), а произведение 2 · 3 = 6 (q). Корни подобраны мгновенно!'
      }
    ],
    mentFeedback: {
      title: 'Анализ готовности от Ment AI',
      summary: 'Отличное владение формулами Виета! Ты экономишь до 90 секунд на каждой задаче, минуя вычисление длинного корня из D = b² - 4ac.',
      masteryTip: 'В олимпиадных заданиях и СОР/СОЧ часто просят найти x₁² + x₂². Помни формулу: x₁² + x₂² = (x₁ + x₂)² - 2x₁x₂ = p² - 2q.',
      bonusTask: 'Найдите x₁² + x₂² для уравнения x² - 6x + 4 = 0: (6)² - 2(4) = 36 - 8 = 28.'
    }
  },

  'Циклы for в Python': {
    topic: 'Циклы for в Python',
    category: 'Computer Science & Python',
    tag: 'Итерации и структуры данных',
    theoryPoints: [
      'Цикл for в Python — это универсальный итератор по последовательностям (спискам, строкам, кортежам, словарям и объектам range).',
      'Функция range(start, stop, step) генерирует числовой диапазон от start до stop-1 с шагом step.',
      'Конструкция enumerate(iterable) возвращает одновременно индекс и значение текущего элемента.',
      'Инструкция break мгновенно прерывает цикл, а continue пропускает остаток текущей итерации и переходит к следующей.'
    ],
    keyFormulaOrCode: {
      title: 'Синтаксис и идиоматичные конструкции',
      content: '# Итерация по списку с индексами\nfruits = ["яблоко", "банан", "груша"]\nfor idx, fruit in enumerate(fruits, start=1):\n    print(f"{idx}. {fruit}")\n\n# Генератор списка (List Comprehension)\nsquares = [x**2 for x in range(1, 6)]  # [1, 4, 9, 16, 25]',
      note: 'В Python for-else выполняется только если цикл завершился без вызова break.'
    },
    quiz: [
      {
        id: 1,
        question: 'Сколько раз выполнится тело цикла for i in range(2, 8, 2)?',
        options: ['3 раза (2, 4, 6)', '4 раза (2, 4, 6, 8)', '6 раз', '2 раза'],
        correctIndex: 0,
        explanation: 'Диапазон range(2, 8, 2) начинает с 2, шагает по +2 и строго не доходит до 8. Значения: 2, 4, 6 (ровно 3 итерации).'
      },
      {
        id: 2,
        question: 'Что выведет код: [x for x in range(5) if x % 2 == 0]?',
        options: ['[0, 2, 4]', '[2, 4]', '[0, 1, 2, 3, 4]', '[1, 3]'],
        correctIndex: 0,
        explanation: 'Числа из range(5) — это 0, 1, 2, 3, 4. Условие x % 2 == 0 истинно для 0, 2 и 4.'
      },
      {
        id: 3,
        question: 'Какая инструкция досрочно завершает работу всего цикла for?',
        options: ['break', 'continue', 'pass', 'exit()'],
        correctIndex: 0,
        explanation: 'Ключевое слово break немедленно выходит из ближайшего объемлющего цикла for или while.'
      }
    ],
    mentFeedback: {
      title: 'Анализ готовности от Ment AI',
      summary: 'Превосходное понимание генераторов и шагов range! Ты готов к созданию сложных алгоритмов обработки данных.',
      masteryTip: 'Избегай модификации списка во время итерации по нему. Используй срез my_list[:] или генератор для фильтрации.',
      bonusTask: 'Напиши генератор словаря: {x: x**3 for x in range(1, 4)} -> {1: 1, 2: 8, 3: 27}.'
    }
  },

  'Закон Ома': {
    topic: 'Закон Ома',
    category: 'Физика (7-9 класс & ЕНТ)',
    tag: 'Электродинамика',
    theoryPoints: [
      'Закон Ома для участка цепи гласит: сила тока I прямо пропорциональна напряжению U и обратно пропорциональна электрическому сопротивлению проводника R.',
      'Основная формула: I = U / R, где ток измеряется в Амперах (А), напряжение в Вольтах (В), сопротивление в Омах (Ом).',
      'При последовательном соединении проводников общее сопротивление складывается: R_общ = R₁ + R₂, а ток одинаков во всех участках цепи.',
      'При параллельном соединении напряжение на всех ветвях одинаково: U = const, а проводимости складываются: 1/R_общ = 1/R₁ + 1/R₂.'
    ],
    keyFormulaOrCode: {
      title: 'Формульный треугольник Ома',
      content: '       [ U ]\n      /     \\\n   [ I ] * [ R ]\n\n1. Найти ток:          I = U / R\n2. Найти напряжение:   U = I * R\n3. Найти сопротивление: R = U / I\n\nМощность тока: P = U * I = I² * R',
      note: 'Сопротивление проводника зависит от геометрии: R = ρ · (L / S).'
    },
    quiz: [
      {
        id: 1,
        question: 'Напряжение на резисторе 24 В, сопротивление 6 Ом. Какова сила тока в цепи?',
        options: ['4 А', '144 А', '0.25 А', '18 А'],
        correctIndex: 0,
        explanation: 'По закону Ома I = U / R = 24 В / 6 Ом = 4 А.'
      },
      {
        id: 2,
        question: 'Два одинаковых резистора по 10 Ом соединены параллельно. Чему равно их общее сопротивление?',
        options: ['5 Ом', '20 Ом', '10 Ом', '2.5 Ом'],
        correctIndex: 0,
        explanation: 'При параллельном соединении одинаковых N резисторов: R_общ = R / N = 10 / 2 = 5 Ом.'
      },
      {
        id: 3,
        question: 'Что произойдет с силой тока, если напряжение увеличить в 3 раза, не меняя сопротивление?',
        options: ['Увеличится в 3 раза', 'Уменьшится в 3 раза', 'Не изменится', 'Увеличится в 9 раз'],
        correctIndex: 0,
        explanation: 'Сила тока прямо пропорциональна напряжению при постоянном сопротивлении: I ~ U.'
      }
    ],
    mentFeedback: {
      title: 'Анализ готовности от Ment AI',
      summary: 'Базовая электродинамика освоена на 100%! Ты уверенно применяешь формулу треугольника Ома для расчета параметров цепи.',
      masteryTip: 'Всегда проверяй размерности перед расчетом: миллиамперы (мА) обязательно переводи в амперы (1 мА = 0.001 А), а килоомы в омы.',
      bonusTask: 'Какая тепловая мощность выделится на резисторе 5 Ом при токе 2 А? Формула: P = I² · R = 4 · 5 = 20 Вт.'
    }
  },

  'Восстание Кенесары Касымова': {
    topic: 'Восстание Кенесары Касымова',
    category: 'История Казахстана',
    tag: '1837–1847 гг. · Национально-освободительное движение',
    theoryPoints: [
      'Восстание 1837–1847 гг. под предводительством султана Кенесары Касымова охватило территорию всех трех казахских жузов и стало крупнейшим национально-освободительным движением XIX века.',
      'Главные цели: сохранение независимости казахских земель, упразднение окружных приказов и ликвидация царских укреплений в степи.',
      'В 1841 году представители трех жузов провозгласили Кенесары Касымова ханом, тем самым временно восстановив единую ханскую власть.',
      'Поражение движения в 1847 году в Семиречье (битва в урочище Майтобе) было вызвано столкновениями с кыргызскими манапами и карательными экспедициями.'
    ],
    keyFormulaOrCode: {
      title: 'Хронологическая лента движения',
      content: '• 1837 г. — Начало восстания: нападение на Ақтауское укрепление\n• 1838 г. — Осада и сожжение Акмолинского укрепления (будущая Астана)\n• 1841 г. — Избрание Кенесары ханом всех трех жузов\n• 1844 г. — Разгром отряда султана Жантюрина в урочище Тобол\n• 1847 г. — Заключительный этап восстания в местности Майтобе',
      note: 'В восстании участвовали батыры Наурызбай, Агыбай, Иман (дед Амангельды Иманова).'
    },
    quiz: [
      {
        id: 1,
        question: 'В каком году Кенесары Касымов был избран ханом всех трех жузов?',
        options: ['1841 г.', '1837 г.', '1844 г.', '1847 г.'],
        correctIndex: 0,
        explanation: 'Осенью 1841 года на всеказахском курултае Кенесары был поднят на белой кошме и провозглашен ханом.'
      },
      {
        id: 2,
        question: 'Какое царское укрепление отряды Кенесары осадили и сожгли в августе 1838 года?',
        options: ['Акмолинское', 'Верное', 'Актауское', 'Кокчетавское'],
        correctIndex: 0,
        explanation: 'В августе 1838 года отряды Кенесары штурмом взяли и сожгли Акмолинское укрепление.'
      },
      {
        id: 3,
        question: 'В какой местности произошло последнее трагическое сражение отряда Кенесары в 1847 году?',
        options: ['Майтобе (Кыргызстан)', 'Ордабасы', 'Улытау', 'Туркестан'],
        correctIndex: 0,
        explanation: 'В апреле 1847 года в холмистой местности Майтобе близ Токмака хан Кенесары принял последний бой.'
      }
    ],
    mentFeedback: {
      title: 'Анализ готовности от Ment AI',
      summary: 'Превосходное знание дат и ключевых событий освободительного движения хана Кенесары. Эти вопросы гарантируют максимальный балл в ЕНТ!',
      masteryTip: 'Обрати внимание на внутреннюю политику Кенесары хана: он ввел единый налог (зекет и ушур), дипломатическую переписку и строгое войсковое деление на десятки и сотни.',
      bonusTask: 'Кто из знаменитых поэтов посвятил хану Кенесары поэтическую поэму? Подсказка: Нысанбай жырау «Кенесары — Наурызбай».'
    }
  },

  'Тригонометрический круг': {
    topic: 'Тригонометрический круг',
    category: 'Геометрия & Алгебра',
    tag: 'Функции sin, cos, tg и радианы',
    theoryPoints: [
      'Единичный тригонометрический круг имеет радиус R = 1 и центр в начале координат (0, 0).',
      'Координата X любой точки на окружности соответствует значению косинуса угла: cos(α) = x.',
      'Координата Y точки на окружности соответствует значению синуса угла: sin(α) = y.',
      'Основное тригонометрическое тождество sin²(α) + cos²(α) = 1 является прямой записью теоремы Пифагора x² + y² = 1 для точки круга.'
    ],
    keyFormulaOrCode: {
      title: 'Знаки и ключевые значения',
      content: 'I четверть  (0 - 90°):    sin > 0, cos > 0\nII четверть (90° - 180°):  sin > 0, cos < 0\nIII четверть(180° - 270°): sin < 0, cos < 0\nIV четверть (270° - 360°): sin < 0, cos > 0\n\nТабличные значения:\nsin(30°) = 1/2,      cos(30°) = √3/2\nsin(45°) = √2/2,     cos(45°) = √2/2\nsin(60°) = √3/2,     cos(60°) = 1/2',
      note: 'Линия тангенсов — вертикальная касательная x = 1, котангенсов — y = 1.'
    },
    quiz: [
      {
        id: 1,
        question: 'В какой четверти и синус, и косинус одновременно отрицательны?',
        options: ['В III четверти', 'Во II четверти', 'В IV четверти', 'В I четверти'],
        correctIndex: 0,
        explanation: 'В III четверти координаты x < 0 и y < 0, следовательно cos(α) < 0 и sin(α) < 0.'
      },
      {
        id: 2,
        question: 'Чему равен cos(180°)?',
        options: ['-1', '0', '1', '1/2'],
        correctIndex: 0,
        explanation: 'Точка поворота на 180° лежит на оси OX слева с координатами (-1, 0). Косинус равен x = -1.'
      },
      {
        id: 3,
        question: 'Чему равен sin(90°)?',
        options: ['1', '0', '-1', '√2/2'],
        correctIndex: 0,
        explanation: 'Точка на 90° лежит на вершине единичного круга (0, 1). Синус равен y = 1.'
      }
    ],
    mentFeedback: {
      title: 'Анализ готовности от Ment AI',
      summary: 'Ты мгновенно визуализируешь оси синуса и косинуса на круге! Это исключает путаницу со знаками в тригонометрических уравнениях.',
      masteryTip: 'Формулы приведения определяются легко: если аргумент содержит половинный угол (π/2, 3π/2), функция меняется на кофункцию (sin -> cos). Знака определяется по четверти исходной функции.',
      bonusTask: 'Найдите значение tg(45°): sin(45°) / cos(45°) = 1.'
    }
  },

  'Flexbox верстка': {
    topic: 'Flexbox верстка',
    category: 'Web Development',
    tag: 'CSS3 & Responsive Layout',
    theoryPoints: [
      'CSS Flexible Box Layout (Flexbox) предназначен для одномерного размещения элементов по главной (main axis) или поперечной (cross axis) оси.',
      'Контейнер объявляется свойством display: flex. По умолчанию главная ось направлена слева направо (flex-direction: row).',
      'Свойство justify-content выравнивает элементы вдоль главной оси (flex-start, center, space-between, space-around).',
      'Свойство align-items управляет выравниванием элементов по поперечной оси (stretch, center, flex-start, flex-end).'
    ],
    keyFormulaOrCode: {
      title: 'Классическое абсолютное центрирование',
      content: '.container {\n  display: flex;\n  justify-content: center; /* Центр по горизонтали */\n  align-items: center;     /* Центр по вертикали */\n  gap: 16px;               /* Современный отступ между элементами */\n  flex-wrap: wrap;         /* Перенос на новую строку при нехватке места */\n}',
      note: 'flex: 1 1 auto позволяет дочернему элементу адаптивно заполнять свободное пространство.'
    },
    quiz: [
      {
        id: 1,
        question: 'Какое свойство CSS выравнивает flex-элементы по главной оси?',
        options: ['justify-content', 'align-items', 'align-content', 'float'],
        correctIndex: 0,
        explanation: 'justify-content распределяет пространство между элементами вдоль главной оси контейнера.'
      },
      {
        id: 2,
        question: 'Какое значение justify-content равномерно распределяет элементы так, чтобы первый и последний прижались к краям?',
        options: ['space-between', 'space-around', 'space-evenly', 'center'],
        correctIndex: 0,
        explanation: 'space-between прижимает первый элемент к началу, последний — к концу, а оставшееся пространство делит между остальными.'
      },
      {
        id: 3,
        question: 'Как изменить главную ось flex-контейнера на вертикальную сверху вниз?',
        options: ['flex-direction: column', 'flex-orientation: vertical', 'flex-flow: down', 'display: grid'],
        correctIndex: 0,
        explanation: 'Свойство flex-direction: column ориентирует главную ось сверху вниз.'
      }
    ],
    mentFeedback: {
      title: 'Анализ готовности от Ment AI',
      summary: 'Отличное владение современной версткой! Flexbox — фундамент для создания адаптивных пользовательских интерфейсов.',
      masteryTip: 'Всегда используй современное свойство gap вместо margins для отступов между flex-элементами.',
      bonusTask: 'Как сделать так, чтобы карточка занимала всю доступную ширину? Установи flex-grow: 1 (или сокращение flex: 1).'
    }
  }
};

// ============================================================================
// Dynamic Generator Fallback (for ANY query typed by user)
// ============================================================================

function generateDynamicLesson(query: string): LessonModule {
  const clean = query.trim();
  return {
    topic: clean,
    category: 'Академический курс · Ment AI',
    tag: 'Индивидуальный модуль',
    theoryPoints: [
      `Тема «${clean}» является ключевым элементом школьной и университетской программы для развития прикладного мышления.`,
      `Фундаментальный принцип «${clean}» строится на понимании базовых закономерностей, алгоритмических шагов и причинно-следственных связей.`,
      `Для успешного решения типовых задач по теме «${clean}» необходимо структурировать входные условия и последовательно применять теорию.`,
      `Регулярная тренировка экспресс-тестами Ment позволяет закрепить навык и сдать СОР/СОЧ/экзамены на максимальный балл.`
    ],
    keyFormulaOrCode: {
      title: `Опорная шпаргалка: ${clean}`,
      content: `1. Входные данные: Анализ условия задачи по теме «${clean}»\n2. Ключевой алгоритм: Выбор проверенной формулы или логической модели\n3. Проверка: Сопоставление размерностей и граничных случаев\n4. Вывод: Окончательная верификация результата`,
      note: 'Ment AI синтезировал базовые тезисы для быстрого повторения перед контрольной.'
    },
    quiz: [
      {
        id: 1,
        question: `Что является ключевой основой для понимания темы «${clean}»?`,
        options: [
          'Последовательное изучение базовых определений и формул',
          'Случайный перебор вариантов ответа',
          'Игнорирование начальных условий задачи',
          'Заучивание ответов без понимания принципа'
        ],
        correctIndex: 0,
        explanation: 'Глубокое понимание сути и формул гарантирует верное решение даже при изменении исходных чисел.'
      },
      {
        id: 2,
        question: `Как Ment AI рекомендует проверять ответ в задачах по направлению «${clean}»?`,
        options: [
          'Подставить полученный результат обратно в исходное уравнение или условие',
          'Сразу переходить к следующей задаче не проверяя',
          'Ориентироваться только на интуицию',
          'Стереть черновик'
        ],
        correctIndex: 0,
        explanation: 'Обратная подстановка — самый надежный способ выявить арифметическую неточность за 10 секунд.'
      },
      {
        id: 3,
        question: `Какой подход обеспечивает максимальный результат при подготовке по теме «${clean}»?`,
        options: [
          'Интерактивная практика 70% ИИ + 30% консультации с ментором-волонтером',
          'Пассивное чтение учебника раз в месяц',
          'Подготовка только в ночь перед экзаменом',
          'Отказ от решения практических тестов'
        ],
        correctIndex: 0,
        explanation: 'Регулярная микро-практика с мгновенным фидбеком дает долговременное закрепление материала в памяти.'
      }
    ],
    mentFeedback: {
      title: `Персональный разбор по теме «${clean}»`,
      summary: `Ты успешно сгенерировал и прошел модуль по теме «${clean}»! Основные термины и опорные формулы усвоены.`,
      masteryTip: 'Сохрани этот конспект в свой профиль Digital Mentor, чтобы повторить перед ближайшим срезом знаний.',
      bonusTask: `Сформулируй собственную задачу по теме «${clean}» и попробуй решить ее за 2 минуты.`
    }
  };
}

// ============================================================================
// Main Application Component
// ============================================================================

export default function DigitalMentorPlatform() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  // Ment AI State
  const [mentTopicInput, setMentTopicInput] = useState<string>('Теорема Виета');
  const [currentLesson, setCurrentLesson] = useState<LessonModule>(PRESET_LESSONS['Теорема Виета']);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [bonusTaskOpen, setBonusTaskOpen] = useState<boolean>(false);
  const [savedNotes, setSavedNotes] = useState<string[]>(['Теорема Виета']);
  
  // UI & Feedback State
  const [notification, setNotification] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeCourseProgram, setActiveCourseProgram] = useState<string>('all');
  const [searchCourseQuery, setSearchCourseQuery] = useState<string>('');

  // Quick chips for on-demand generator
  const SUGGESTION_CHIPS = [
    'Теорема Виета',
    'Циклы for в Python',
    'Закон Ома',
    'Восстание Кенесары Касымова',
    'Тригонометрический круг',
    'Flexbox верстка'
  ];

  // Helper: Trigger Notification Toast
  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Handler: Generate Ment AI Lesson
  const handleGenerateLesson = (topicToGenerate: string) => {
    const trimmed = topicToGenerate.trim();
    if (!trimmed) return;

    setIsGenerating(true);
    setUserQuizAnswers({});
    setBonusTaskOpen(false);

    setTimeout(() => {
      if (PRESET_LESSONS[trimmed]) {
        setCurrentLesson(PRESET_LESSONS[trimmed]);
      } else {
        setCurrentLesson(generateDynamicLesson(trimmed));
      }
      setIsGenerating(false);
      setCurrentView('ment-ai');
      triggerToast(`Урок по теме «${trimmed}» успешно сгенерирован!`);
    }, 300);
  };

  // Handler: Select Quiz Answer
  const handleAnswerSelect = (questionId: number, optionIdx: number) => {
    setUserQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  // Handler: Save Lesson to Profile
  const handleSaveNote = () => {
    if (!savedNotes.includes(currentLesson.topic)) {
      setSavedNotes((prev) => [...prev, currentLesson.topic]);
      triggerToast(`Конспект «${currentLesson.topic}» сохранен в профиль! +20 XP`);
    } else {
      triggerToast(`Конспект уже находится в твоем профиле.`);
    }
  };

  // Calculate Quiz Score
  const calculateScore = () => {
    let correct = 0;
    currentLesson.quiz.forEach((q) => {
      if (userQuizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const answeredCount = Object.keys(userQuizAnswers).length;
  const correctCount = calculateScore();

  return (
    <div className="min-h-screen bg-[#080E1E] text-white flex flex-col font-sans select-none">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-[9999] bg-[#0E1D3D] border border-[#38bdf8] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-sm font-semibold text-[#e0f2fe]">{notification}</span>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F172A] border border-red-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <LogOut className="w-6 h-6" />
              <h3 className="text-lg font-bold">Выйти из аккаунта?</h3>
            </div>
            <p className="text-sm text-slate-300">
              Вы уверены, что хотите завершить сессию? Все несохраненные данные текущей практики останутся в кэше.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  triggerToast('Сессия сброшена. Вы вошли как Гость.');
                }}
                className="px-4 py-2 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg transition-colors"
              >
                Подтвердить выход
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* ================================================================== */}
        {/* 1. NARROW LEFT VERTICAL SIDEBAR (76px)                             */}
        {/* ================================================================== */}
        <aside className="w-[76px] min-w-[76px] h-screen sticky top-0 left-0 bg-[#0B1226] border-r border-slate-800/80 flex flex-col items-center justify-between py-5 z-50">
          {/* Top Logo Mark */}
          <button
            onClick={() => setCurrentView('dashboard')}
            className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:scale-105 transition-transform"
            title="Digital Mentor Home"
          >
            D
          </button>

          {/* Navigation Icons Stack */}
          <nav className="flex flex-col items-center gap-3.5 w-full">
            {/* 1. Dashboard */}
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] border border-[#38bdf8]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Дашборд"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Дашборд
              </span>
            </button>

            {/* 2. MENT AI (Featured On-Demand Learning Engine) */}
            <button
              onClick={() => setCurrentView('ment-ai')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'ment-ai'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#38bdf8] text-white shadow-[0_0_22px_rgba(56,189,248,0.6)] border border-[#38bdf8]'
                  : 'text-[#38bdf8] hover:bg-[#38bdf8]/10'
              }`}
              title="Ment AI (24/7)"
            >
              <Sparkles className="w-5 h-5 animate-pulse text-[#38bdf8]" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-[#38bdf8]/60 text-[#38bdf8] text-xs font-bold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                ⚡ Ment AI (24/7)
              </span>
            </button>

            {/* 3. Courses */}
            <button
              onClick={() => setCurrentView('courses')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'courses'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] border border-[#38bdf8]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Курсы"
            >
              <BookOpen className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Курсы
              </span>
            </button>

            {/* 4. Schedule */}
            <button
              onClick={() => setCurrentView('schedule')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'schedule'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] border border-[#38bdf8]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Расписание"
            >
              <Calendar className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Расписание
              </span>
            </button>

            {/* 5. Achievements */}
            <button
              onClick={() => setCurrentView('achievements')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'achievements'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] border border-[#38bdf8]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Достижения"
            >
              <Award className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Достижения
              </span>
            </button>

            {/* 6. Profile */}
            <button
              onClick={() => setCurrentView('profile')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'profile'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] border border-[#38bdf8]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Профиль"
            >
              <User className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Профиль
              </span>
            </button>

            {/* 7. Admin Panel */}
            <button
              onClick={() => setCurrentView('admin')}
              className={`group relative w-11 h-11 rounded-[14px] flex items-center justify-center transition-all ${
                currentView === 'admin'
                  ? 'bg-gradient-to-br from-[#0284c7] to-[#0ea5e9] text-white shadow-[0_0_20px_rgba(56,189,248,0.45)] border border-[#38bdf8]/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Админ-панель"
            >
              <Shield className="w-5 h-5" />
              <span className="absolute left-[calc(100%+14px)] bg-[#0F172A] border border-slate-700 text-white text-xs font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl z-50">
                Админ-панель
              </span>
            </button>
          </nav>

          {/* Bottom Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-colors"
            title="Выйти из аккаунта"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </aside>

        {/* ================================================================== */}
        {/* 2. MAIN APPLICATION WORKSPACE                                      */}
        {/* ================================================================== */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#080E1E]">
          {/* TOP APP HEADER (72px) */}
          <header className="h-[72px] sticky top-0 z-40 bg-[#080E1E]/90 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between">
            {/* Left Header Logo & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#38bdf8] text-white font-extrabold text-base flex items-center justify-center shadow-[0_0_14px_rgba(56,189,248,0.3)]">
                D
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[17px] tracking-tight text-white leading-none">
                  Digital Mentor
                </span>
                <span className="text-[11.5px] text-slate-400 mt-1 font-medium">
                  Академическое наставничество · Астана
                </span>
              </div>
            </div>

            {/* Right Header Badges & Actions */}
            <div className="flex items-center gap-3.5">
              {/* Role Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-slate-800 text-xs font-semibold text-slate-200">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                <span>Роль: Администратор</span>
              </div>

              {/* Notification Bell */}
              <button
                onClick={() => triggerToast('Уведомлений нет. Все академические сессии актуальны.')}
                className="relative w-10 h-10 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-white hover:border-[#38bdf8]/40 flex items-center justify-center transition-colors"
                title="Уведомления"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
              </button>

              {/* Chat with Ment Button */}
              <button
                onClick={() => setCurrentView('ment-ai')}
                className="w-10 h-10 rounded-xl bg-[#0F172A] border border-slate-800 text-slate-300 hover:text-white hover:border-[#38bdf8]/40 flex items-center justify-center transition-colors"
                title="Чат с Ment (24/7)"
              >
                <MessageSquare className="w-4 h-4 text-[#38bdf8]" />
              </button>

              {/* Profile Avatar Badge */}
              <button
                onClick={() => setCurrentView('profile')}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-[#0F172A] border border-[#38bdf8]/40 text-[#38bdf8] font-bold text-xs hover:border-[#38bdf8] transition-colors"
                title="Личный профиль"
              >
                АН
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-[#080E1E]" />
              </button>
            </div>
          </header>

          {/* MAIN VIEWPORT */}
          <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-8">
            {/* ============================================================== */}
            {/* VIEW 1: DASHBOARD (ГЛАВНЫЙ ЭКРАН)                              */}
            {/* ============================================================== */}
            {currentView === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                {/* Hero Greeting Section */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#38bdf8]">
                    Обзорная панель
                  </span>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Привет, Ансар Нурлан! 👋
                  </h1>
                  <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                    Сводка твоего учебного процесса, активные программы и ближайшие онлайн-сессии с напарниками.
                  </p>
                </div>

                {/* 4 Metric Cards in a row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Card 1 */}
                  <div className="bg-[#0F172A] border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-1.5 hover:border-[#38bdf8]/40 transition-colors">
                    <span className="text-xs text-slate-400 font-medium">Активные программы</span>
                    <span className="text-2xl font-extrabold text-[#38bdf8]">8 курсов</span>
                    <span className="text-[11.5px] text-[#34d399] font-medium">+2 за последний месяц</span>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#0F172A] border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-1.5 hover:border-[#38bdf8]/40 transition-colors">
                    <span className="text-xs text-slate-400 font-medium">Уроков на неделе</span>
                    <span className="text-2xl font-extrabold text-[#38bdf8]">0 уроков</span>
                    <span className="text-[11.5px] text-slate-400 font-medium">Следующий: Понедельник, 16:00</span>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#0F172A] border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-1.5 hover:border-[#38bdf8]/40 transition-colors">
                    <span className="text-xs text-slate-400 font-medium">Продуктивность с Ment</span>
                    <span className="text-2xl font-extrabold text-[#38bdf8]">2.0 ч</span>
                    <span className="text-[11.5px] text-[#34d399] font-medium">+45 мин за сегодня</span>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-[#0F172A] border border-slate-800/90 rounded-2xl p-5 flex flex-col gap-1.5 hover:border-[#38bdf8]/40 transition-colors">
                    <span className="text-xs text-slate-400 font-medium">Посещаемость</span>
                    <span className="text-2xl font-extrabold text-[#38bdf8]">100%</span>
                    <span className="text-[11.5px] text-[#34d399] font-medium">Без пропусков</span>
                  </div>
                </div>

                {/* Horizontal Next Meeting Card */}
                <div className="bg-gradient-to-r from-[#0E1D3D]/90 to-[#0F172A]/95 border border-[#38bdf8]/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_8px_32px_rgba(0,8,30,0.4)]">
                  <div className="flex items-center gap-5">
                    <div className="w-13 h-13 rounded-2xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center text-2xl flex-shrink-0 p-3">
                      📹
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-bold text-[#38bdf8] uppercase tracking-wider">
                        Ближайшая онлайн-встреча
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Онлайн-сессии завершены / Нет предстоящих уроков
                      </h3>
                      <div className="text-xs text-slate-400">
                        Все запланированные занятия на этой неделе проведены. Выберите курс в каталоге или задайте вопрос Ment.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setCurrentView('schedule')}
                      className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
                    >
                      Расписание
                    </button>
                    <button
                      onClick={() => setCurrentView('schedule')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white text-xs font-bold shadow-[0_4px_18px_rgba(56,189,248,0.35)] hover:brightness-110 transition-all"
                    >
                      Перейти к расписанию →
                    </button>
                  </div>
                </div>

                {/* Learning Directions Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Учебные направления платформы</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Выберите подходящий формат обучения для достижения целей
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentView('courses')}
                      className="text-xs font-bold text-[#38bdf8] hover:underline"
                    >
                      Каталог курсов →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Track 1 */}
                    <div
                      onClick={() => {
                        setActiveCourseProgram('mentoring');
                        setCurrentView('courses');
                      }}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 hover:border-[#38bdf8]/40 hover:bg-[#131E38] transition-all cursor-pointer group space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-lg">
                          👤
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          1-на-1
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        Наставничество
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Индивидуальные регулярные онлайн-сессии со школьником-волонтёром для углублённого разбора тем.
                      </p>
                      <div className="pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-800/80">
                        Индивидуальный темп • 1–2 раза в нед.
                      </div>
                    </div>

                    {/* Track 2 */}
                    <div
                      onClick={() => {
                        setActiveCourseProgram('sor');
                        setCurrentView('courses');
                      }}
                      className="bg-[#0E1D3D] border-2 border-[#38bdf8] rounded-2xl p-6 shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:bg-[#13234d] transition-all cursor-pointer group space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center font-bold text-lg">
                          🎯
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40">
                          СОР / СОЧ
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        Подготовка к СОР/СОЧ
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Интенсивный разбор типовых заданий четверти, сложных математических формул и критериев оценивания.
                      </p>
                      <div className="pt-2 text-[11px] font-semibold text-[#38bdf8] border-t border-blue-900/50">
                        Алгоритмы и формулы • Срезы знаний
                      </div>
                    </div>

                    {/* Track 3 */}
                    <div
                      onClick={() => {
                        setActiveCourseProgram('workshops');
                        setCurrentView('courses');
                      }}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 hover:border-[#38bdf8]/40 hover:bg-[#131E38] transition-all cursor-pointer group space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-lg">
                          ⚡
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          Группы
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                        Воркшопы
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Интерактивные групповые мастер-классы, разборы олимпиадных задач и экспресс-тестирование.
                      </p>
                      <div className="pt-2 text-[11px] font-semibold text-slate-500 border-t border-slate-800/80">
                        Практикумы • Командный разбор
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Launch Ment AI Banner */}
                <div className="bg-gradient-to-r from-[#0B1528] to-[#0E1D3D] border border-[#38bdf8]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(56,189,248,0.4)]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">Нужна помощь с уроком прямо сейчас?</h4>
                      <p className="text-xs text-slate-400">
                        Запусти Ment AI — интеллектуальный генератор выжимок теории, микро-тестов и персональных разборов.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('ment-ai')}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white text-xs font-bold shadow-[0_4px_18px_rgba(56,189,248,0.35)] hover:scale-105 transition-transform whitespace-nowrap"
                  >
                    Запустить Ment AI →
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 2: MENT AI (ON-DEMAND LEARNING ENGINE)                    */}
            {/* ============================================================== */}
            {currentView === 'ment-ai' && (
              <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
                {/* Ment AI Hero Header */}
                <div className="flex flex-col gap-2">
                  <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#38bdf8]">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>AI MENTOR 24/7 · ON-DEMAND ENGINE</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Ment AI — Твой персональный наставник
                  </h1>
                  <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
                    Мгновенная генерация интерактивного модуля по любой школьной или технической теме: краткая выжимка, микро-тест и персональный разбор.
                  </p>
                </div>

                {/* Topic Search & Input Engine */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleGenerateLesson(mentTopicInput);
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={mentTopicInput}
                        onChange={(e) => setMentTopicInput(e.target.value)}
                        placeholder="Какую тему ты хочешь изучить? (например: Теорема Виета, Циклы for в Python, Восстание Кенесары Касымова)..."
                        className="w-full pl-11 pr-4 py-3 bg-[#080E1E] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8] transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isGenerating || !mentTopicInput.trim()}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#38bdf8] hover:brightness-110 disabled:opacity-50 text-white font-bold text-xs shadow-[0_4px_18px_rgba(56,189,248,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Генерация...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Сгенерировать урок</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Suggestion Chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-400">Быстрый выбор:</span>
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setMentTopicInput(chip);
                          handleGenerateLesson(chip);
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                          currentLesson.topic === chip
                            ? 'bg-[#38bdf8]/15 border-[#38bdf8] text-[#38bdf8] font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                            : 'bg-[#080E1E] border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ============================================================ */}
                {/* GENERATED LESSON: 3 BLOCKS IN ONE UNIFIED VIEW               */}
                {/* ============================================================ */}
                <div className="space-y-6">
                  {/* Topic Badge Bar */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] text-xs font-bold">
                        {currentLesson.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Тег: {currentLesson.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Сохранить конспект</span>
                      </button>
                    </div>
                  </div>

                  {/* BLOCK 1: ВЫЖИМКА ТЕОРИИ (Bite-sized Theory) */}
                  <section className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#38bdf8]">
                      <span className="w-6 h-6 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-xs">
                        1
                      </span>
                      <span>Блок 1: Выжимка теории (Bite-sized Theory)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Theory Bullet Points */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-white">
                          Суть темы: {currentLesson.topic}
                        </h3>
                        <ul className="space-y-2.5">
                          {currentLesson.theoryPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                              <span className="w-5 h-5 rounded-md bg-[#080E1E] border border-slate-700 text-[#38bdf8] font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Formula / Syntax Code Card */}
                      <div className="bg-[#080E1E] border border-slate-800 rounded-xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#38bdf8]">
                          <span>{currentLesson.keyFormulaOrCode.title}</span>
                          <span className="text-[10px] text-slate-500">Ment Reference</span>
                        </div>
                        <pre className="font-mono text-xs text-slate-200 bg-[#060A14] p-3 rounded-lg border border-slate-900 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {currentLesson.keyFormulaOrCode.content}
                        </pre>
                        <p className="text-[11px] text-slate-400 italic">
                          💡 {currentLesson.keyFormulaOrCode.note}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* BLOCK 2: ИНТЕРАКТИВНЫЙ МИКРО-ТЕСТ (Practice Quiz) */}
                  <section className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#38bdf8]">
                        <span className="w-6 h-6 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-xs">
                          2
                        </span>
                        <span>Блок 2: Интерактивный микро-тест (Practice Quiz)</span>
                      </div>

                      <div className="text-xs font-bold px-3 py-1 rounded-full bg-[#080E1E] border border-slate-800 text-slate-300">
                        Результат: <span className="text-[#38bdf8]">{correctCount}</span> из{' '}
                        <span>{currentLesson.quiz.length}</span> решено верно
                        {answeredCount > 0 && <span className="text-[#10b981] ml-1.5">(+{correctCount * 15} XP)</span>}
                      </div>
                    </div>

                    <div className="space-y-5">
                      {currentLesson.quiz.map((q, qIdx) => {
                        const selectedAnswer = userQuizAnswers[q.id];
                        const isAnswered = selectedAnswer !== undefined;
                        const isCorrect = isAnswered && selectedAnswer === q.correctIndex;

                        return (
                          <div
                            key={q.id}
                            className="bg-[#080E1E] border border-slate-800/90 rounded-xl p-5 space-y-4"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center flex-shrink-0">
                                {qIdx + 1}
                              </span>
                              <div className="text-sm font-semibold text-white leading-snug">
                                {q.question}
                              </div>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-9">
                              {q.options.map((opt, optIdx) => {
                                const isThisSelected = selectedAnswer === optIdx;
                                const isThisCorrect = isAnswered && optIdx === q.correctIndex;
                                const isThisWrong = isAnswered && isThisSelected && !isCorrect;

                                let btnStyle = 'border-slate-800 bg-[#0F172A] text-slate-300 hover:border-slate-700';

                                if (isThisCorrect) {
                                  btnStyle = 'border-[#10b981] bg-[#10b981]/15 text-[#34d399] font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)]';
                                } else if (isThisWrong) {
                                  btnStyle = 'border-red-500 bg-red-500/15 text-red-300';
                                } else if (isThisSelected) {
                                  btnStyle = 'border-[#38bdf8] bg-[#38bdf8]/15 text-[#38bdf8]';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleAnswerSelect(q.id, optIdx)}
                                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <span className="w-5 h-5 rounded-md border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-400">
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span>{opt}</span>
                                    </div>
                                    {isThisCorrect && <Check className="w-4 h-4 text-[#10b981]" />}
                                    {isThisWrong && <X className="w-4 h-4 text-red-500" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Question Explanation if answered */}
                            {isAnswered && (
                              <div className="ml-9 p-3 rounded-lg bg-[#060A14] border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-[#38bdf8] font-bold">[Разбор]:</span>
                                <span>{q.explanation}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* BLOCK 3: ПЕРСОНАЛЬНЫЙ ФИДБЕК И РАЗБОР (Feedback & Action) */}
                  <section className="bg-gradient-to-br from-[#0F172A] to-[#0E1D3D] border border-[#38bdf8]/40 rounded-2xl p-6 shadow-xl space-y-5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#38bdf8]">
                        <span className="w-6 h-6 rounded-lg bg-[#38bdf8]/15 border border-[#38bdf8]/30 flex items-center justify-center text-xs">
                          3
                        </span>
                        <span>Блок 3: Персональный фидбек и разбор</span>
                      </div>
                      <span className="text-xs font-bold text-[#10b981] flex items-center gap-1">
                        <CheckCheck className="w-4 h-4" />
                        <span>Socratic AI Verified</span>
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-base font-bold text-white">
                        {currentLesson.mentFeedback.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {currentLesson.mentFeedback.summary}
                      </p>
                      <div className="p-3.5 rounded-xl bg-[#080E1E] border border-slate-800 text-xs text-slate-200 space-y-1">
                        <div className="text-[#38bdf8] font-bold text-[11px] uppercase tracking-wider">
                          Совет от Ment для экзамена:
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {currentLesson.mentFeedback.masteryTip}
                        </p>
                      </div>
                    </div>

                    {/* Bonus Challenge Drawer */}
                    {bonusTaskOpen && (
                      <div className="p-4 rounded-xl bg-[#060A14] border border-[#10b981]/50 text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 text-[#34d399] font-bold">
                          <Zap className="w-4 h-4" />
                          <span>Бонусная задача на закрепление:</span>
                        </div>
                        <p className="text-slate-200">{currentLesson.mentFeedback.bonusTask}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => {
                          setBonusTaskOpen(!bonusTaskOpen);
                          triggerToast('Бонусная задача открыта!');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#10b981] hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-[0_4px_18px_rgba(16,185,129,0.3)] cursor-pointer"
                      >
                        <Zap className="w-4 h-4" />
                        <span>{bonusTaskOpen ? 'Скрыть задачу' : 'Закрепить тему еще одной задачей'}</span>
                      </button>

                      <button
                        onClick={handleSaveNote}
                        className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Bookmark className="w-4 h-4 text-[#38bdf8]" />
                        <span>Сохранить конспект в профиль</span>
                      </button>

                      <button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          triggerToast('Выберите новую тему в поле поиска выше.');
                        }}
                        className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                      >
                        Изучить другую тему ↑
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 3: COURSES (КУРСЫ И ПРОГРАММЫ)                            */}
            {/* ============================================================== */}
            {currentView === 'courses' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                      Академические программы и курсы
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                      Выберите направление подготовки к СОР/СОЧ или индивидуальное наставничество.
                    </p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-2 bg-[#0F172A] border border-slate-800 p-1.5 rounded-xl">
                    <button
                      onClick={() => setActiveCourseProgram('all')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        activeCourseProgram === 'all'
                          ? 'bg-[#38bdf8] text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Все направления (8)
                    </button>
                    <button
                      onClick={() => setActiveCourseProgram('mentoring')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        activeCourseProgram === 'mentoring'
                          ? 'bg-[#38bdf8] text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      1-на-1
                    </button>
                    <button
                      onClick={() => setActiveCourseProgram('sor')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        activeCourseProgram === 'sor'
                          ? 'bg-[#38bdf8] text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      СОР / СОЧ
                    </button>
                    <button
                      onClick={() => setActiveCourseProgram('workshops')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                        activeCourseProgram === 'workshops'
                          ? 'bg-[#38bdf8] text-slate-950 shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Воркшопы
                    </button>
                  </div>
                </div>

                {/* 8 Course Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    {
                      id: 'alg-9',
                      title: 'Алгебра 9 класс (СОР/СОЧ)',
                      program: 'sor',
                      badge: 'СОР/СОЧ',
                      mentor: 'Дамир С. (НИШ Астана)',
                      rating: '4.95',
                      xp: '+80 XP',
                      desc: 'Квадратичная функция, системы уравнений, теорема Виета и неравенства.'
                    },
                    {
                      id: 'sat-math',
                      title: 'SAT Math & Олимпиадные задачи',
                      program: 'mentoring',
                      badge: '1-на-1',
                      mentor: 'Ансар Н. (Lead Mentor)',
                      rating: '5.0',
                      xp: '+120 XP',
                      desc: 'Сложные текстовые задачи, функции, геометрия и тригонометрический круг.'
                    },
                    {
                      id: 'py-zero',
                      title: 'Python для школьников с нуля',
                      program: 'workshops',
                      badge: 'Воркшоп',
                      mentor: 'Алихан Т. (Astana Hub)',
                      rating: '4.9',
                      xp: '+90 XP',
                      desc: 'Синтаксис, списки, циклы for/while, словари и разработка телеграм-ботов.'
                    },
                    {
                      id: 'phys-electr',
                      title: 'Физика: Электродинамика и ток',
                      program: 'sor',
                      badge: 'СОР/СОЧ',
                      mentor: 'Малика К. (РФМШ)',
                      rating: '4.88',
                      xp: '+70 XP',
                      desc: 'Закон Ома, соединение проводников, работа и мощность тока, закон Джоуля-Ленца.'
                    },
                    {
                      id: 'kz-hist',
                      title: 'История Казахстана: Ключевые восстания',
                      program: 'mentoring',
                      badge: '1-на-1',
                      mentor: 'Айзере Б. (ЕНТ 138)',
                      rating: '4.92',
                      xp: '+60 XP',
                      desc: 'Хан Кенесары, восстания XIX века, карта жузов и культура кочевников.'
                    },
                    {
                      id: 'geom-plane',
                      title: 'Планиметрия и векторы (10 класс)',
                      program: 'sor',
                      badge: 'СОР/СОЧ',
                      mentor: 'Санжар Ж. (НИШ ФМН)',
                      rating: '4.85',
                      xp: '+75 XP',
                      desc: 'Теорема синусов и косинусов, площади треугольников и скалярное произведение.'
                    },
                    {
                      id: 'web-front',
                      title: 'Frontend-разработка: HTML & CSS',
                      program: 'workshops',
                      badge: 'Воркшоп',
                      mentor: 'Ерсултан М. (Frontend Dev)',
                      rating: '4.97',
                      xp: '+100 XP',
                      desc: 'Flexbox, CSS Grid, адаптивный дизайн интерфейсов и публикация сайтов.'
                    },
                    {
                      id: 'eng-ielts',
                      title: 'Academic English & Essay Writing',
                      program: 'mentoring',
                      badge: '1-на-1',
                      mentor: 'Камила А. (IELTS 8.0)',
                      rating: '4.98',
                      xp: '+110 XP',
                      desc: 'Структура эссе Task 2, академический вокабуляр и беглая речь на Speaking.'
                    }
                  ]
                    .filter((c) => activeCourseProgram === 'all' || c.program === activeCourseProgram)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 hover:border-[#38bdf8]/40 hover:bg-[#131E38] transition-all group"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30">
                              {course.badge}
                            </span>
                            <span className="text-xs font-bold text-[#10b981]">{course.xp}</span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {course.desc}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <div className="text-[11.5px] text-slate-400">
                            Ментор: <strong className="text-slate-200">{course.mentor}</strong>
                          </div>
                          <button
                            onClick={() => {
                              setMentTopicInput(course.title.split('(')[0].trim());
                              handleGenerateLesson(course.title.split('(')[0].trim());
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
                          >
                            Начать урок →
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 4: SCHEDULE (РАСПИСАНИЕ СЕССИЙ)                           */}
            {/* ============================================================== */}
            {currentView === 'schedule' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Расписание онлайн-сессий
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Ближайшие синхронные занятия с менторами и расписание воркшопов на неделю.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      day: 'Понедельник, 16:00 – 17:00',
                      subject: 'Алгебра 9 класс: Разбор типовых задач СОР 1',
                      mentor: 'Дамир С. (НИШ)',
                      type: '1-на-1 Онлайн',
                      status: 'Предстоит',
                      meetUrl: 'https://meet.google.com'
                    },
                    {
                      day: 'Среда, 17:30 – 18:30',
                      subject: 'Практикум Python: Циклы и генераторы списков',
                      mentor: 'Алихан Т. (Astana Hub)',
                      type: 'Групповой воркшоп',
                      status: 'Предстоит',
                      meetUrl: 'https://meet.google.com'
                    },
                    {
                      day: 'Пятница, 16:00 – 17:00',
                      subject: 'Физика: Расчет электрических цепей и сопротивлений',
                      mentor: 'Малика К. (РФМШ)',
                      type: '1-на-1 Онлайн',
                      status: 'Предстоит',
                      meetUrl: 'https://meet.google.com'
                    }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#38bdf8]/40 transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[#38bdf8] flex items-center justify-center text-xl flex-shrink-0">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#38bdf8] mb-0.5">{item.day}</div>
                          <h4 className="text-sm font-bold text-white">{item.subject}</h4>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Ментор: <strong className="text-slate-200">{item.mentor}</strong> • {item.type}
                          </div>
                        </div>
                      </div>

                      <a
                        href={item.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                      >
                        <Video className="w-4 h-4" />
                        <span>Google Meet →</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 5: ACHIEVEMENTS (ДОСТИЖЕНИЯ)                              */}
            {/* ============================================================== */}
            {currentView === 'achievements' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Достижения и академические награды
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Твои успехи в решении микро-тестов, подготовке к СОР/СОЧ и работе с Ment AI.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'Повелитель Виета',
                      desc: '100% правильных ответов в микро-тесте по Теореме Виета без единой ошибки.',
                      badge: 'Математика',
                      unlocked: true
                    },
                    {
                      title: 'Кодер Python',
                      desc: 'Решены все тестовые кейсы и генераторы списков на платформе.',
                      badge: 'IT & Code',
                      unlocked: true
                    },
                    {
                      title: 'Эрудит Истории',
                      desc: 'Пройден исторический модуль по восстаниям XIX века.',
                      badge: 'История',
                      unlocked: true
                    },
                    {
                      title: 'Серийный ученик',
                      desc: '3 дня подряд активной практики в студии Ment AI.',
                      badge: 'Дисциплина',
                      unlocked: true
                    },
                    {
                      title: 'СОР на 100%',
                      desc: 'Закрыты все срезы знаний текущей четверти на высший балл.',
                      badge: 'Аттестация',
                      unlocked: false
                    },
                    {
                      title: 'Ментор-волонтер',
                      desc: 'Проведено 10 академических консультаций для младших классов.',
                      badge: 'Волонтерство',
                      unlocked: false
                    }
                  ].map((ach, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                        ach.unlocked
                          ? 'bg-[#0F172A] border-[#38bdf8]/40 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                          : 'bg-[#0B101E] border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                          ach.unlocked
                            ? 'bg-gradient-to-br from-[#0284c7] to-[#38bdf8] text-white shadow-md'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              ach.unlocked
                                ? 'bg-[#10b981]/20 text-[#34d399]'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {ach.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{ach.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 6: PROFILE (ЛИЧНЫЙ ПРОФИЛЬ & КОНСПЕКТЫ)                  */}
            {/* ============================================================== */}
            {currentView === 'profile' && (
              <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-5">
                    <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#38bdf8] text-white font-extrabold text-2xl flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.4)] p-4">
                      АН
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-white">Ансар Нурлан</h2>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/40">
                          Администратор
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">ansarnurlan2@gmail.com • Астана, Казахстан</p>
                      <div className="text-[11px] font-medium text-[#10b981] flex items-center gap-1.5 pt-1">
                        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                        <span>Активная сессия · Google OAuth верифицирован</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-center">
                    <div className="bg-[#080E1E] border border-slate-800 rounded-xl px-4 py-2.5">
                      <div className="text-lg font-extrabold text-[#38bdf8]">620</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Очков XP</div>
                    </div>
                    <div className="bg-[#080E1E] border border-slate-800 rounded-xl px-4 py-2.5">
                      <div className="text-lg font-extrabold text-[#10b981]">8</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Курсов</div>
                    </div>
                  </div>
                </div>

                {/* Saved Ment AI Notes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">Сохраненные конспекты Ment AI</h3>
                      <p className="text-xs text-slate-400">
                        Твоя личная база знаний: сохраненные формулы и выжимки для экзаменов
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#38bdf8] bg-[#38bdf8]/15 px-3 py-1 rounded-full border border-[#38bdf8]/30">
                      {savedNotes.length} конспектов
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedNotes.map((topic, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-[#38bdf8]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Bookmark className="w-5 h-5 text-[#38bdf8]" />
                          <div>
                            <h4 className="text-sm font-bold text-white">{topic}</h4>
                            <span className="text-[11px] text-slate-400">Выжимка теории + Микро-тест</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setMentTopicInput(topic);
                            handleGenerateLesson(topic);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 text-[#38bdf8] text-xs font-bold transition-colors"
                        >
                          Открыть →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 7: ADMIN PANEL (МОДУЛЬ АДМИНИСТРАТОРА)                     */}
            {/* ============================================================== */}
            {currentView === 'admin' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                      Панель администратора
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                      Мониторинг платформы, верификация волонтерских часов и управление пользователями.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#10b981]/15 text-[#34d399] border border-[#10b981]/40 text-xs font-bold">
                    Superadmin Mode
                  </span>
                </div>

                {/* Metric Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5">
                    <span className="text-xs text-slate-400">Всего пользователей</span>
                    <div className="text-2xl font-extrabold text-[#38bdf8] mt-1">1,420</div>
                    <span className="text-[11px] text-[#34d399]">+84 за неделю</span>
                  </div>
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5">
                    <span className="text-xs text-slate-400">Активных менторов</span>
                    <div className="text-2xl font-extrabold text-[#38bdf8] mt-1">84</div>
                    <span className="text-[11px] text-slate-400">Школьники НИШ / РФМШ</span>
                  </div>
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5">
                    <span className="text-xs text-slate-400">Подтверждено часов</span>
                    <div className="text-2xl font-extrabold text-[#38bdf8] mt-1">312 ч</div>
                    <span className="text-[11px] text-[#34d399]">В сертификаты</span>
                  </div>
                  <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5">
                    <span className="text-xs text-slate-400">Проведено уроков</span>
                    <div className="text-2xl font-extrabold text-[#38bdf8] mt-1">520</div>
                    <span className="text-[11px] text-slate-400">100% положительных отзывов</span>
                  </div>
                </div>

                {/* Users Management Table */}
                <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">Список ключевых пользователей</h3>
                    <button
                      onClick={() => triggerToast('База данных синхронизирована с Supabase.')}
                      className="text-xs font-bold text-[#38bdf8] hover:underline"
                    >
                      Синхронизировать базу
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-[#080E1E] text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">Пользователь</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Роль</th>
                          <th className="p-3">Часов волонтёрства</th>
                          <th className="p-3">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        <tr>
                          <td className="p-3 font-bold text-white">Ансар Нурлан</td>
                          <td className="p-3 text-slate-400">ansarnurlan2@gmail.com</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] font-bold text-[10px]">
                              Администратор
                            </span>
                          </td>
                          <td className="p-3 text-slate-200">120 ч</td>
                          <td className="p-3 text-[#10b981] font-semibold">Активен</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Дамир Сабитов</td>
                          <td className="p-3 text-slate-400">damir.sabitov@nish.kz</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                              Ментор-волонтер
                            </span>
                          </td>
                          <td className="p-3 text-slate-200">48 ч</td>
                          <td className="p-3 text-[#10b981] font-semibold">Активен</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Айзере Берикова</td>
                          <td className="p-3 text-slate-400">aizere.berik@gmail.com</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                              Ученик
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">—</td>
                          <td className="p-3 text-[#10b981] font-semibold">Активен</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. FLOATING 24/7 MENT BUTTON (BOTTOM RIGHT)                         */}
      {/* ================================================================== */}
      <div className="fixed bottom-7 right-7 z-50">
        <button
          onClick={() => {
            setCurrentView('ment-ai');
            triggerToast('Студия Ment AI активирована!');
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white font-bold text-xs shadow-[0_6px_24px_rgba(56,189,248,0.5)] hover:scale-105 hover:shadow-[0_8px_30px_rgba(56,189,248,0.7)] transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
          </div>
          <span className="tracking-wide">Ment · 24/7</span>
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
        </button>
      </div>
    </div>
  );
}
