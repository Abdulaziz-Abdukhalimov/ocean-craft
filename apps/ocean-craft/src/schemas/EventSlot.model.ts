import { Schema } from 'mongoose';

export const EventSlotSchema = new Schema(
	{
		eventId: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
			required: true,
		},
		date: {
			type: Date,
			required: true,
		},
		totalCapacity: {
			type: Number,
			required: true,
		},
		bookedCapacity: {
			type: Number,
			default: 0,
		},
		remainingCapacity: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true },
);

EventSlotSchema.index({ eventId: 1, date: 1 }, { unique: true });
export default EventSlotSchema;
