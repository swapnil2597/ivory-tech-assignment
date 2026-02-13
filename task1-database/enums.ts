export enum NotificationType {
    TRANSACTIONAL = 'transactional',
    MARKETING = 'marketing',
    ALERT = 'alert',
    REMINDER = 'reminder',
  }
  
  export enum NotificationChannel {
    PUSH = 'push',
    EMAIL = 'email',
    IN_APP = 'in_app',
  }
  
  export enum DeliveryStatus {
    PENDING = 'pending',
    SENT = 'sent',
    DELIVERED = 'delivered',
    FAILED = 'failed',
  }
  