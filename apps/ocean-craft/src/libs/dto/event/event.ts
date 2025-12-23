import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import {
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
	EventStatus,
	EventAvailabilityStatus,
} from '../../enums/event.enum';
import { Member } from '../member/member';

@ObjectType()
class EventLocation {
	@Field(() => String)
	city: string;

	@Field(() => String)
	address: string;
}

@ObjectType()
class EventTimeSlot {
	@Field(() => String)
	startTime: string;

	@Field(() => String)
	endTime: string;
}

@ObjectType()
class EventSpecificDate {
	@Field(() => Date)
	date: Date;

	@Field(() => String)
	startTime: string;

	@Field(() => String)
	endTime: string;
}

@ObjectType()
class EventSchedule {
	@Field(() => EventScheduleType)
	type: EventScheduleType;

	@Field(() => [EventDayOfWeek], { nullable: true })
	daysOfWeek?: EventDayOfWeek[];

	@Field(() => [EventTimeSlot], { nullable: true })
	timeSlots?: EventTimeSlot[];

	@Field(() => [EventSpecificDate], { nullable: true })
	specificDates?: EventSpecificDate[];
}

@ObjectType()
class EventPeriod {
	@Field(() => Date)
	startDate: Date;

	@Field(() => Date)
	endDate: Date;
}

@ObjectType()
class EventContact {
	@Field(() => String, { nullable: true })
	phone?: string;

	@Field(() => String, { nullable: true })
	email?: string;

	@Field(() => String, { nullable: true })
	telegram?: string;
}

@ObjectType()
class EventRequirements {
	@Field(() => Int, { nullable: true })
	minAge?: number;

	@Field(() => Int, { nullable: true })
	maxAge?: number;

	@Field(() => [String], { nullable: true })
	bringItems?: string[];

	@Field(() => EventExperienceLevel, { nullable: true })
	experienceLevel?: EventExperienceLevel;
}

// MAIN EVENT TYPE
@ObjectType()
export class Event {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	businessId: ObjectId;

	@Field(() => Member, { nullable: true })
	businessData?: Member;

	@Field(() => String)
	eventTitle: string;

	@Field(() => String)
	eventDescription: string;

	@Field(() => EventCategory)
	eventCategory: EventCategory;

	@Field(() => String)
	businessName: string;

	@Field(() => Float)
	eventPrice: number;

	@Field(() => EventCurrency)
	eventCurrency: EventCurrency;

	@Field(() => EventLocation)
	eventLocation: EventLocation;

	@Field(() => EventSchedule)
	eventSchedule: EventSchedule;

	@Field(() => EventPeriod)
	eventPeriod: EventPeriod;

	@Field(() => Date, { nullable: true })
	eventRegistrationDeadline?: Date;

	@Field(() => EventContact)
	eventContact: EventContact;

	@Field(() => [String])
	eventImages: string[];

	@Field(() => EventAvailabilityStatus)
	eventAvailabilityStatus: EventAvailabilityStatus;

	@Field(() => Int)
	eventCapacity: number;

	@Field(() => Int)
	eventDurationMinutes: number;

	@Field(() => EventRequirements, { nullable: true })
	eventRequirements?: EventRequirements;

	@Field(() => String, { nullable: true })
	eventNotes?: string;

	@Field(() => String, { nullable: true })
	eventCancellationPolicy?: string;

	@Field(() => EventStatus)
	eventStatus: EventStatus;

	@Field(() => Int)
	eventViews: number;

	@Field(() => Int)
	eventLikes: number;

	@Field(() => Int)
	eventComments: number;

	@Field(() => Float)
	eventRank: number;

	@Field(() => Date, { nullable: true })
	approvedAt?: Date;

	@Field(() => Date, { nullable: true })
	rejectedAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	//from aggregation
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	// NEW: Add this for translation support (optional in response)
	// @Field(() => String, { nullable: true })
	// originalLanguage?: string;

	//  NEW: These fields are populated by frontend translation
	// // Not stored in DB, but can be in GraphQL response
	// @Field(() => Boolean, { nullable: true })
	// _isTranslated?: boolean;

	// @Field(() => String, { nullable: true })
	// _translatedFrom?: string;

	// @Field(() => String, { nullable: true })
	// _translatedTo?: string;
}
