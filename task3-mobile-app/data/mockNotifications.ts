import { Notification } from '../types/notification';

const types: Notification['type'][] = [
  'transactional',
  'marketing',
  'alert',
  'reminder',
];

const randomType = () =>
  types[Math.floor(Math.random() * types.length)];

export const generateMockNotifications = (
  count: number = 100
): Notification[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${i + 1}`,
    type: randomType(),
    title: `Notification Title ${i + 1}`,
    body: `This is the body content for notification ${
      i + 1
    }. It contains detailed information.`,
    createdAt: new Date(
      Date.now() - Math.random() * 100000000
    ).toISOString(),
    isRead: Math.random() > 0.5,
  }));
};

export const fetchNotifications = async (): Promise<
  Notification[]
> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockNotifications(100));
    }, 300); // 300ms delay
  });
};
