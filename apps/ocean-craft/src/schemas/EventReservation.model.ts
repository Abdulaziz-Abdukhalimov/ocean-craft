import { Schema } from 'mongoose';
import { EventStatus, PaymentMethod, PaymentStatus } from '../libs/enums/event.enum';

export const ReservationSchema = new Schema(
	{
		eventId: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
		},
		slotId: {
			type: Schema.Types.ObjectId,
			ref: 'EventSlot',
			required: true,
		},
		memberId: {
			type: Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},

		reservationDate: {
			type: Date,
			required: true,
		},
		numberOfPeople: {
			type: Number,
			required: true,
			min: 1,
		},

		contactPerson: {
			fullName: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
			_id: false,
		},

		pricePerPerson: {
			type: Number,
			required: true,
		},
		totalAmount: {
			type: Number,
			required: true,
		},

		paymentMethod: {
			type: String,
			enum: PaymentMethod,
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: PaymentStatus,
			default: PaymentStatus.PENDING,
		},

		status: {
			type: String,
			enum: EventStatus,
			default: EventStatus.CONFIRMED,
		},
	},
	{ timestamps: true },
);

ReservationSchema.index({ eventId: 1, reservationDate: 1 });
ReservationSchema.index({ memberId: 1, status: 1 });

export default ReservationSchema;
