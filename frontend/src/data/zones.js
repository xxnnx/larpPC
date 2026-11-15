import standardImage from '../assets/standard.jpg';
import standardPlusImage from '../assets/standard-plus.jpg';
import consoleImage from '../assets/console.jpg';

const zones = [
  {
    id: 'standard',
    name: 'СТАНДАРТ',
    label: 'ИГРОВАЯ ЗОНА',
    description: 'Комфортное игровое место для любимых игр.',
    price: 150,
    image: standardImage,

    equipment: {
      processor: 'Intel Core i5',
      graphics: 'NVIDIA GeForce RTX 3060',
      ram: '16 ГБ',
      monitor: '24" · 144 Гц',
      keyboard: 'Игровая механическая',
      mouse: 'Игровая',
      headset: 'Игровая гарнитура',
    },

    features: [
      'Игровой компьютер',
      'Монитор 144 Гц',
      'Механическая клавиатура',
      'Игровая мышь',
      'Игровая гарнитура',
    ],

    tariffs: [
      {
        duration: '1 час',
        hours: 1,
        price: '150 ₽',
      },
      {
        duration: '3 часа',
        hours: 3,
        price: '400 ₽',
      },
      {
        duration: '5 часов',
        hours: 5,
        price: '600 ₽',
      },
      {
        duration: '10 часов',
        hours: 10,
        price: '1100 ₽',
      },
    ],
  },

  {
    id: 'standard-plus',
    name: 'СТАНДАРТ+',
    label: 'ИГРОВАЯ ЗОНА',
    description: 'Более мощное оборудование для требовательных игр.',
    price: 200,
    image: standardPlusImage,

    equipment: {
      processor: 'Intel Core i7',
      graphics: 'NVIDIA GeForce RTX 4070',
      ram: '32 ГБ',
      monitor: '27" · 240 Гц',
      keyboard: 'Игровая механическая',
      mouse: 'Игровая',
      headset: 'Профессиональная игровая гарнитура',
    },

    features: [
      'Мощный игровой компьютер',
      'Монитор 240 Гц',
      'Механическая клавиатура',
      'Профессиональная мышь',
      'Игровая гарнитура',
    ],

    tariffs: [
      {
        duration: '1 час',
        hours: 1,
        price: '200 ₽',
      },
      {
        duration: '3 часа',
        hours: 3,
        price: '550 ₽',
      },
      {
        duration: '5 часов',
        hours: 5,
        price: '850 ₽',
      },
      {
        duration: '10 часов',
        hours: 10,
        price: '1500 ₽',
      },
    ],
  },

  {
    id: 'console',
    name: 'ПРИСТАВКА',
    label: 'КОНСОЛЬНАЯ ЗОНА',
    description: 'Игровая зона с PlayStation и большим экраном.',
    price: 250,
    image: consoleImage,

    equipment: {
      console: 'PlayStation 5',
      display: 'Большой 4K экран',
      controller: '2 × DualSense',
      sound: 'Игровая акустика',
    },

    features: [
      'PlayStation 5',
      'Большой 4K экран',
      'Два контроллера DualSense',
      'Игровая акустика',
    ],

    tariffs: [
      {
        duration: '1 час',
        hours: 1,
        price: '250 ₽',
      },
      {
        duration: '3 часа',
        hours: 3,
        price: '700 ₽',
      },
      {
        duration: '5 часов',
        hours: 5,
        price: '1100 ₽',
      },
    ],
  },
];

export default zones;