// Sunday School Lessons Data
// 24 lessons for He Reigns Chapel

export interface Lesson {
  id: number;
  title: string;
  filename: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Teach Them to Study',
    filename: 'TEACH THEM TO STUDY - 1.pdf',
  },
  {
    id: 2,
    title: 'Teach Them to Seek God',
    filename: 'TEACH THEM TO SEEK GOD - 2.pdf',
  },
  {
    id: 3,
    title: 'Teach Them to Avoid Evil Company',
    filename: 'TEACH THEM TO AVOID EVIL COMPANY - 3.pdf',
  },
  {
    id: 4,
    title: 'Abraham',
    filename: 'ABRAHAM - 4.pdf',
  },
  {
    id: 5,
    title: 'Burial',
    filename: 'BURIAL - 5.pdf',
  },
  {
    id: 6,
    title: 'Widowhood',
    filename: 'WIDOWHOOD - 6.pdf',
  },
  {
    id: 7,
    title: 'Family Vices 1: Remiss',
    filename: 'SUB-THEME: FAMILY VICES 1: REMISS - 7.pdf',
  },
  {
    id: 8,
    title: 'Family Vices 2: Infidelity',
    filename: 'FAMILY VICES 2: INFIDELITY - 8.pdf',
  },
  {
    id: 9,
    title: 'Family Vices 3: Adultery',
    filename: 'FAMILY VICES 3: ADULTERY - 9.pdf',
  },
  {
    id: 10,
    title: 'Family Vices 4: Separation',
    filename: 'FAMILY VICES 4: SEPARATION - 10.pdf',
  },
  {
    id: 11,
    title: 'Fathers, Where Are You?',
    filename: 'FATHERS, WHERE ARE YOU? - 11.pdf',
  },
  {
    id: 12,
    title: 'Family Vices 5: Divorce',
    filename: 'FAMILY VICES 5: DIVORCE - 12.pdf',
  },
  {
    id: 13,
    title: 'Envy',
    filename: 'ENVY - 13.pdf',
  },
  {
    id: 14,
    title: 'Unforgiveness',
    filename: 'UNFORGIVENESS - 14.pdf',
  },
  {
    id: 15,
    title: 'Rebellion',
    filename: 'REBELLION - 15.pdf',
  },
  {
    id: 16,
    title: 'Modesty',
    filename: 'MODESTY - 16.pdf',
  },
  {
    id: 17,
    title: 'Loyalty',
    filename: 'LOYALTY - 17.pdf',
  },
  {
    id: 18,
    title: 'The Fundamental Principles of Loyalty',
    filename: 'THE FUNDAMENTAL PRINCIPLES OF LOYALTY - 18.pdf',
  },
  {
    id: 19,
    title: 'Attitude and Habits of a Loyal Individual',
    filename: 'ATTITUDE AND HABITS OF A LOYAL INDIVIDUAL - 19.pdf',
  },
  {
    id: 20,
    title: 'The Three Tests of Loyalty',
    filename: 'THE THREE TESTS OF LOYALTY - 20.pdf',
  },
  {
    id: 21,
    title: 'Gratitude and Testimonies',
    filename: 'GRATITUDE AND TESTIMONIES - 21.pdf',
  },
  {
    id: 22,
    title: 'Understanding Harvest',
    filename: 'UNDERSTANDING HARVEST - 22.pdf',
  },
  {
    id: 23,
    title: 'The Reward of Service',
    filename: 'THE REWARD OF SERVICE - 23.pdf',
  },
  {
    id: 24,
    title: 'Why His Birth',
    filename: 'WHY HIS BIRTH - 24.pdf',
  },
];

export const getTotalLessons = (): number => LESSONS.length;

export const getLessonById = (id: number): Lesson | undefined => {
  return LESSONS.find((lesson) => lesson.id === id);
};

export const getLessonByFilename = (filename: string): Lesson | undefined => {
  return LESSONS.find((lesson) => lesson.filename === filename);
};
