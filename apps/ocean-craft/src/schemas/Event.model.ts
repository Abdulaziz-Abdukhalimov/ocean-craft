import { Schema } from 'mongoose';
import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventScheduleType,
	EventStatus,
} from '../libs/enums/event.enum';

const EventSchema = new Schema(
	{
		businessId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
		eventTitle: {
			type: {
				ko: { type: String, required: true },
				en: { type: String, required: true },
				uz: { type: String },
				ru: { type: String },
			},
			required: true,
			_id: false,
		},
		eventDescription: {
			type: {
				ko: { type: String, required: true },
				en: { type: String, required: true },
				uz: { type: String },
				ru: { type: String },
			},
			required: true,
			_id: false,
		},
		eventCategory: {
			type: String,
			enum: EventCategory,
			required: true,
		},
		businessName: {
			type: String,
			required: true,
		},
		eventPrice: {
			type: Number,
			required: true,
		},
		eventCurrency: {
			type: String,
			enum: EventCurrency,
			default: EventCurrency.KRW,
		},
		eventLocation: {
			city: {
				type: String,
				required: true,
			},
			address: {
				type: String,
				required: true,
			},
			_id: false,
		},
		eventSchedule: {
			type: {
				type: String,
				enum: EventScheduleType,
				default: EventScheduleType.RECURRING,
			},
			daysOfWeek: {
				type: [String],
			},
			timeSlots: {
				type: [String],
			},
			specificDates: {
				type: [Date],
			},
			_id: false,
		},
		eventContact: {
			phone: {
				type: String,
			},
			email: {
				type: String,
			},
			telegram: {
				type: String,
			},
			_id: false,
		},
		eventImages: {
			type: [String],
			required: true,
		},
		eventAvailabilityStatus: {
			type: String,
			enum: EventAvailabilityStatus,
			default: EventAvailabilityStatus.AVAILABLE,
		},
		eventCapacity: {
			type: Number,
			required: true,
		},
		eventDuration: {
			type: String,
			required: true,
		},
		eventStatus: {
			type: String,
			enum: EventStatus,
			default: EventStatus.PENDING,
		},
		eventViews: {
			type: Number,
			default: 0,
		},
		eventLikes: {
			type: Number,
			default: 0,
		},
		eventComments: {
			type: Number,
			default: 0,
		},
		eventRank: {
			type: Number,
			default: 0,
		},
		approvedAt: {
			type: Date,
		},
		rejectedAt: {
			type: Date,
		},
		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'events' },
);
// Indexes
EventSchema.index({ eventCategory: 1, 'eventLocation.city': 1, eventPrice: 1 });
EventSchema.index({ businessId: 1, eventStatus: 1 });
EventSchema.index({ eventStatus: 1, eventAvailabilityStatus: 1 });
EventSchema.index({
	'eventTitle.ko': 'text',
	'eventTitle.en': 'text',
	'eventDescription.ko': 'text',
	'eventDescription.en': 'text',
});
export default EventSchema;
