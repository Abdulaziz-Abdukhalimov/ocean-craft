import { Field, Int, Float, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member } from '../member/member';
import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
	EventStatus,
} from '../../enums/event.enum';

@ObjectType()
export class Event {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	businessId: ObjectId;

	@Field(() => Member, { nullable: true })
	businessData?: Member;

	@Field(() => MultiLanguageField)
	eventTitle: MultiLanguageField;

	@Field(() => MultiLanguageField)
	eventDescription: MultiLanguageField;

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

	@Field(() => MultiLanguageField, { nullable: true })
	eventNotes?: MultiLanguageField;

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
}

// Nested Types
@ObjectType()
class MultiLanguageField {
	@Field(() => String)
	ko: string;

	@Field(() => String)
	en: string;

	@Field(() => String, { nullable: true })
	uz?: string;

	@Field(() => String, { nullable: true })
	ru?: string;
}

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
