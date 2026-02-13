import { Schema, model, Types, Document } from 'mongoose';
import {
  NotificationType,
  NotificationChannel,
} from './enums';
import { DeliverySchema, IDelivery } from './delivery.schema';

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  metadata?: Record<string, any>;
  channels: NotificationChannel[];
  deliveries: IDelivery[];
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
    channels: [
      {
        type: String,
        enum: Object.values(NotificationChannel),
        required: true,
      },
    ],
    deliveries: {
      type: [DeliverySchema],
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = model<INotification>(
  'Notification',
  NotificationSchema
);
