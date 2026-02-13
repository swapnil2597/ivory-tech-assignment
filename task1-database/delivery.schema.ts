import { Schema, Types } from 'mongoose';
import {
  NotificationChannel,
  DeliveryStatus,
} from './enums';

export interface IDelivery {
  channel: NotificationChannel;
  status: DeliveryStatus;
  providerMessageId?: string;
  errorMessage?: string;
  attempts: number;
  sentAt?: Date;
  deliveredAt?: Date;
  updatedAt: Date;
}

export const DeliverySchema = new Schema<IDelivery>(
  {
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      required: true,
      default: DeliveryStatus.PENDING,
    },
    providerMessageId: {
      type: String,
      required: false,
    },
    errorMessage: {
      type: String,
      required: false,
    },
    attempts: {
      type: Number,
      required: true,
      default: 0,
    },
    sentAt: {
      type: Date,
      required: false,
    },
    deliveredAt: {
      type: Date,
      required: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);
