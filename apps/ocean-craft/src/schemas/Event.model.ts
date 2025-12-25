import { Schema } from 'mongoose';
import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
	EventStatus,
} from '../libs/enums/event.enum';

const EventSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
		eventTitle: {
			type: String,
			required: true,
		},
		eventDescription: {
			type: String,
			required: true,
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
				required: true,
			},
			daysOfWeek: {
				type: [String],
				enum: EventDayOfWeek,
			},
			timeSlots: [
				{
					startTime: {
						type: String,
						required: true,
					},
					endTime: {
						type: String,
						required: true,
					},
					_id: false,
				},
			],
			specificDates: [
				{
					date: {
						type: Date,
						required: true,
					},
					startTime: {
						type: String,
						required: true,
					},
					endTime: {
						type: String,
						required: true,
					},
					_id: false,
				},
			],
			_id: false,
		},
		eventPeriod: {
			startDate: {
				type: Date,
				required: true,
			},
			endDate: {
				type: Date,
				required: true,
			},
			_id: false,
		},
		eventRegistrationDeadline: {
			type: Date,
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
			default: 0,
		},
		eventDurationMinutes: {
			type: Number,
			required: true,
		},
		eventRequirements: {
			minAge: {
				type: Number,
			},
			maxAge: {
				type: Number,
			},
			bringItems: {
				type: [String],
			},
			experienceLevel: {
				type: String,
				enum: EventExperienceLevel,
			},
			_id: false,
		},
		eventNotes: {
			type: String,
		},
		eventCancellationPolicy: {
			type: String,
			maxlength: 1000,
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
EventSchema.index({ 'eventPeriod.startDate': 1, 'eventPeriod.endDate': 1 });

export default EventSchema;
