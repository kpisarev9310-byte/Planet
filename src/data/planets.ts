export interface Planet {
  id: string;
  name: string;
  nameRu: string;
  radius: number; // km
  distanceFromSun: number; // million km
  orbitalPeriod: number; // Earth days
  color: string;
  glowColor: string;
  displayRadius: number; // for visualization
  orbitRadius: number; // for visualization
  description: string;
  funFact: string;
  frequency: number; // musical frequency in Hz
  note: string;
  moons: number;
  temperature: string;
  type: string;
}

export const planets: Planet[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 2439.7,
    distanceFromSun: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    glowColor: '#8a8a8a',
    displayRadius: 4,
    orbitRadius: 60,
    description: 'Самая маленькая и ближайшая к Солнцу планета',
    funFact: 'День на Меркурии длится 59 земных дней, а год — всего 88 дней!',
    frequency: 523.25, // C5
    note: 'До',
    moons: 0,
    temperature: '-180°C до +430°C',
    type: 'Скалистая планета'
  },
  {
    id: 'venus',
    name: 'Venus',
    nameRu: 'Венера',
    radius: 6051.8,
    distanceFromSun: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    glowColor: '#d4a950',
    displayRadius: 7,
    orbitRadius: 95,
    description: 'Самая горячая планета из-за парникового эффекта',
    funFact: 'Венера вращается в обратном направлении — Солнце восходит на западе!',
    frequency: 587.33, // D5
    note: 'Ре',
    moons: 0,
    temperature: '+462°C',
    type: 'Скалистая планета'
  },
  {
    id: 'earth',
    name: 'Earth',
    nameRu: 'Земля',
    radius: 6371,
    distanceFromSun: 149.6,
    orbitalPeriod: 365.25,
    color: '#4da6ff',
    glowColor: '#2d8bdb',
    displayRadius: 7,
    orbitRadius: 130,
    description: 'Наш дом — единственная известная планета с жизнью',
    funFact: 'Земля — единственная планета, не названная в честь бога!',
    frequency: 659.25, // E5
    note: 'Ми',
    moons: 1,
    temperature: '-89°C до +57°C',
    type: 'Скалистая планета'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameRu: 'Марс',
    radius: 3389.5,
    distanceFromSun: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    glowColor: '#c0503a',
    displayRadius: 5,
    orbitRadius: 170,
    description: 'Красная планета — главный кандидат для колонизации',
    funFact: 'На Марсе находится Олимп — самый высокий вулкан в Солнечной системе (22 км)!',
    frequency: 698.46, // F5
    note: 'Фа',
    moons: 2,
    temperature: '-140°C до +20°C',
    type: 'Скалистая планета'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 69911,
    distanceFromSun: 778.5,
    orbitalPeriod: 4333,
    color: '#c8a87c',
    glowColor: '#a08060',
    displayRadius: 16,
    orbitRadius: 225,
    description: 'Крупнейшая планета — газовый гигант',
    funFact: 'Большое Красное Пятно на Юпитере — шторм, бушующий уже более 350 лет!',
    frequency: 783.99, // G5
    note: 'Соль',
    moons: 95,
    temperature: '-110°C',
    type: 'Газовый гигант'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 58232,
    distanceFromSun: 1434,
    orbitalPeriod: 10759,
    color: '#e8d5a3',
    glowColor: '#c4b080',
    displayRadius: 14,
    orbitRadius: 285,
    description: 'Знаменит своими великолепными кольцами',
    funFact: 'Сатурн настолько лёгкий, что мог бы плавать в воде (если бы нашёлся такой океан)!',
    frequency: 880, // A5
    note: 'Ля',
    moons: 146,
    temperature: '-178°C',
    type: 'Газовый гигант'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 25362,
    distanceFromSun: 2871,
    orbitalPeriod: 30687,
    color: '#7de8e8',
    glowColor: '#50c0c0',
    displayRadius: 10,
    orbitRadius: 340,
    description: 'Ледяной гигант, вращающийся "на боку"',
    funFact: 'Уран вращается лёжа на боку — его ось наклонена на 98°!',
    frequency: 987.77, // B5
    note: 'Си',
    moons: 28,
    temperature: '-224°C',
    type: 'Ледяной гигант'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 24622,
    distanceFromSun: 4495,
    orbitalPeriod: 60190,
    color: '#4466ff',
    glowColor: '#3350cc',
    displayRadius: 10,
    orbitRadius: 390,
    description: 'Самая далёкая планета с самыми быстрыми ветрами',
    funFact: 'Ветры на Нептуне достигают 2100 км/ч — быстрее скорости звука!',
    frequency: 1046.5, // C6
    note: 'До',
    moons: 16,
    temperature: '-218°C',
    type: 'Ледяной гигант'
  }
];
