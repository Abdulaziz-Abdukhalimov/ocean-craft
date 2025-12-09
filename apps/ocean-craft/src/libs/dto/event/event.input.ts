import { Field, InputType, Int, Float, ObjectType } from '@nestjs/graphql';
import {
	IsNotEmpty,
	IsOptional,
	Length,
	IsNumber,
	Min,
	Max,
	IsArray,
	IsEnum,
	IsEmail,
	Matches,
	ArrayMinSize,
	ValidateNested,
	IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
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

import { Direction } from '../../enums/common.enum';
import { availableEventSorts } from '../../config';
import { MultiLanguageInput, MultiLanguageInputLong } from '../common/multilanguage';
import { Event } from './event';

@InputType()
class EventLocationInput {
	@IsNotEmpty()
	@Length(2, 100)
	@Field(() => String)
	city: string;

	@IsNotEmpty()
	@Length(5, 300)
	@Field(() => String)
	address: string;
}

@InputType()
class EventTimeSlotInput {
	@IsNotEmpty()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	@Field(() => String)
	startTime: string;

	@IsNotEmpty()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	@Field(() => String)
	endTime: string;
}

@InputType()
class EventSpecificDateInput {
	@IsNotEmpty()
	@Field(() => Date)
	date: Date;

	@IsNotEmpty()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	@Field(() => String)
	startTime: string;

	@IsNotEmpty()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	@Field(() => String)
	endTime: string;
}

@InputType()
class EventScheduleInput {
	@IsNotEmpty()
	@Field(() => EventScheduleType)
	type: EventScheduleType;

	@IsOptional()
	@IsArray()
	@Field(() => [EventDayOfWeek], { nullable: true })
	daysOfWeek?: EventDayOfWeek[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EventTimeSlotInput)
	@Field(() => [EventTimeSlotInput], { nullable: true })
	timeSlots?: EventTimeSlotInput[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EventSpecificDateInput)
	@Field(() => [EventSpecificDateInput], { nullable: true })
	specificDates?: EventSpecificDateInput[];
}

@InputType()
class EventPeriodInput {
	@IsNotEmpty()
	@Field(() => Date)
	startDate: Date;

	@IsNotEmpty()
	@Field(() => Date)
	endDate: Date;
}

@InputType()
class EventContactInput {
	@IsOptional()
	@Length(10, 20)
	@Field(() => String, { nullable: true })
	phone?: string;

	@IsOptional()
	@IsEmail()
	@Length(5, 100)
	@Field(() => String, { nullable: true })
	email?: string;

	@IsOptional()
	@Length(3, 50)
	@Field(() => String, { nullable: true })
	telegram?: string;
}

@InputType()
class EventRequirementsInput {
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	@Field(() => Int, { nullable: true })
	minAge?: number;

	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	@Field(() => Int, { nullable: true })
	maxAge?: number;

	@IsOptional()
	@IsArray()
	@Field(() => [String], { nullable: true })
	bringItems?: string[];

	@IsOptional()
	@Field(() => EventExperienceLevel, { nullable: true })
	experienceLevel?: EventExperienceLevel;
}

@InputType()
class MultiLanguageNotesInput {
	@IsOptional()
	@Length(1, 1000)
	@Field(() => String, { nullable: true })
	ko?: string;

	@IsOptional()
	@Length(1, 1000)
	@Field(() => String, { nullable: true })
	en?: string;

	@IsOptional()
	@Length(1, 1000)
	@Field(() => String, { nullable: true })
	uz?: string;

	@IsOptional()
	@Length(1, 1000)
	@Field(() => String, { nullable: true })
	ru?: string;
}

@InputType()
export class PriceRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
class EISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	businessId?: ObjectId;

	@IsOptional()
	@Field(() => [EventCategory], { nullable: true })
	categoryList?: EventCategory[];

	@IsOptional()
	@Field(() => [EventAvailabilityStatus], { nullable: true })
	availabilityList?: EventAvailabilityStatus[];

	@IsOptional()
	@Field(() => PriceRange, { nullable: true })
	pricesRange?: PriceRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	city?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class EventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => EISearch)
	search: EISearch;
}

@InputType()
class BEISearch {
	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Field(() => [EventCategory], { nullable: true })
	categoryList?: EventCategory[];
}

@InputType()
export class BusinessEventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => BEISearch)
	search: BEISearch;
}

@InputType()
class AEISearch {
	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Field(() => [EventCategory], { nullable: true })
	categoryList?: EventCategory[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	businessId?: ObjectId;
}

@InputType()
export class AllEventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => AEISearch)
	search: AEISearch;
}

@InputType()
export class OrdinaryInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}

// Pagination Metadata
@ObjectType()
export class MetaData {
	@Field(() => Int, { nullable: true })
	total: number;
}

// Events Response with Pagination
@ObjectType()
export class Events {
	@Field(() => [Event])
	list: Event[];

	@Field(() => [MetaData], { nullable: true })
	metaData: MetaData[];
}

// Main Event Input
@InputType()
export class EventCreate {
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => MultiLanguageInput)
	@Field(() => MultiLanguageInput)
	eventTitle: MultiLanguageInput;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => MultiLanguageInputLong)
	@Field(() => MultiLanguageInputLong)
	eventDescription: MultiLanguageInputLong;

	@IsNotEmpty()
	@Field(() => EventCategory)
	eventCategory: EventCategory;

	@IsNotEmpty()
	@Min(0)
	@Field(() => Float)
	eventPrice: number;

	@IsOptional()
	@Field(() => EventCurrency, { nullable: true })
	eventCurrency?: EventCurrency;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => EventLocationInput)
	@Field(() => EventLocationInput)
	eventLocation: EventLocationInput;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => EventScheduleInput)
	@Field(() => EventScheduleInput)
	eventSchedule: EventScheduleInput;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => EventPeriodInput)
	@Field(() => EventPeriodInput)
	eventPeriod: EventPeriodInput;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	eventRegistrationDeadline?: Date;

	@IsNotEmpty()
	@ValidateNested()
	@Type(() => EventContactInput)
	@Field(() => EventContactInput)
	eventContact: EventContactInput;

	@IsNotEmpty()
	@ArrayMinSize(1)
	@Field(() => [String])
	eventImages: string[];

	@IsNotEmpty()
	@IsNumber()
	@Min(0)
	@Field(() => Int)
	eventCapacity: number;

	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	@Field(() => Int)
	eventDurationMinutes: number;

	@IsNotEmpty()
	@Field(() => EventAvailabilityStatus)
	eventAvailabilityStatus: EventAvailabilityStatus;

	@IsOptional()
	@ValidateNested()
	@Type(() => EventRequirementsInput)
	@Field(() => EventRequirementsInput, { nullable: true })
	eventRequirements?: EventRequirementsInput;

	@IsOptional()
	@ValidateNested()
	@Type(() => MultiLanguageNotesInput)
	@Field(() => MultiLanguageNotesInput, { nullable: true })
	eventNotes?: MultiLanguageNotesInput;

	@IsOptional()
	@Length(10, 1000)
	@Field(() => String, { nullable: true })
	eventCancellationPolicy?: string;

	businessId?: ObjectId;
}

// Nested Input Types
// @InputType()
// class MultiLanguageInput {
// 	@IsNotEmpty()
// 	@Length(1, 200)
// 	@Field(() => String)
// 	ko: string;

// 	@IsNotEmpty()
// 	@Length(1, 200)
// 	@Field(() => String)
// 	en: string;

// 	@IsOptional()
// 	@Length(1, 200)
// 	@Field(() => String, { nullable: true })
// 	uz?: string;

// 	@IsOptional()
// 	@Length(1, 200)
// 	@Field(() => String, { nullable: true })
// 	ru?: string;
// }

// @InputType()
// class MultiLanguageDescriptionInput {
// 	@IsNotEmpty()
// 	@Length(10, 2000)
// 	@Field(() => String)
// 	ko: string;

// 	@IsNotEmpty()
// 	@Length(10, 2000)
// 	@Field(() => String)
// 	en: string;

// 	@IsOptional()
// 	@Length(10, 2000)
// 	@Field(() => String, { nullable: true })
// 	uz?: string;

// 	@IsOptional()
// 	@Length(10, 2000)
// 	@Field(() => String, { nullable: true })
// 	ru?: string;
// }
