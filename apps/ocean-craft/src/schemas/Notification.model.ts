import { Schema } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../libs/enums/notification.enum';
import { ref } from 'process';

const NotificationSchema = new Schema(
	{
		notificationType: {
			type: String,
			enum: NotificationType,
			required: true,
		},

		notificationStatus: {
			type: String,
			enum: NotificationStatus,
			default: NotificationStatus.WAIT,
		},

		notificationGroup: {
			type: String,
			enum: NotificationGroup,
			required: true,
		},

		notificationTitle: {
			type: String,
			required: true,
		},

		notificationDesc: {
			type: String,
		},

		authorId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		receiverId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
		},

		eventId: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
		},

		inquiryId: {
			type: Schema.Types.ObjectId,
			ref: 'Inquiry',
		},

		readAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'notifications' },
);

export default NotificationSchema;
