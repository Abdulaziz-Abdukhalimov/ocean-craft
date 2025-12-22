import { Field, Int, Float, InputType } from '@nestjs/graphql';
import {
	IsString,
	IsNumber,
	IsEnum,
	IsArray,
	IsOptional,
	Min,
	Max,
	MaxLength,
	ValidateNested,
	ArrayMinSize,
	IsDateString,
	IsEmail,
	Matches,
	IsNotEmpty,
	Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
} from '../../enums/event.enum';
import { ObjectId } from 'mongoose';

@InputType()
class EventLocationUpdateInput {
	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(100)
	city?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(300)
	address?: string;
}

@InputType()
class EventTimeSlotUpdateInput {
	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	startTime?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	endTime?: string;
}

@InputType()
class EventSpecificDateUpdateInput {
	@IsOptional()
	@Field(() => Date, { nullable: true })
	@IsDateString()
	date?: Date;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	startTime?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	endTime?: string;
}

@InputType()
class EventScheduleUpdateInput {
	@IsOptional()
	@Field(() => EventScheduleType, { nullable: true })
	@IsEnum(EventScheduleType)
	type?: EventScheduleType;

	@IsOptional()
	@Field(() => [EventDayOfWeek], { nullable: true })
	@IsArray()
	@IsEnum(EventDayOfWeek, { each: true })
	daysOfWeek?: EventDayOfWeek[];

	@IsOptional()
	@Field(() => [EventTimeSlotUpdateInput], { nullable: true })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EventTimeSlotUpdateInput)
	timeSlots?: EventTimeSlotUpdateInput[];

	@IsOptional()
	@Field(() => [EventSpecificDateUpdateInput], { nullable: true })
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EventSpecificDateUpdateInput)
	specificDates?: EventSpecificDateUpdateInput[];
}

@InputType()
class EventPeriodUpdateInput {
	@IsOptional()
	@Field(() => Date, { nullable: true })
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	@IsDateString()
	endDate?: Date;
}

@InputType()
class EventContactUpdateInput {
	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(20)
	phone?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsEmail()
	@MaxLength(100)
	email?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(50)
	telegram?: string;
}

@InputType()
class EventRequirementsUpdateInput {
	@IsOptional()
	@Field(() => Int, { nullable: true })
	@IsNumber()
	@Min(0)
	@Max(100)
	minAge?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	@IsNumber()
	@Min(0)
	@Max(100)
	maxAge?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	@IsArray()
	@IsString({ each: true })
	@MaxLength(100, { each: true })
	bringItems?: string[];

	@IsOptional()
	@Field(() => EventExperienceLevel, { nullable: true })
	@IsEnum(EventExperienceLevel)
	experienceLevel?: EventExperienceLevel;
}

// MAIN EVENT UPDATE INPUT
@InputType()
export class EventUpdate {
	@IsString()
	@Field(() => String)
	@IsNotEmpty()
	_id: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@Length(1, 200)
	eventTitle?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@Length(10, 2000)
	eventDescription?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(400)
	businessName?: string;

	@IsOptional()
	@Field(() => EventCategory, { nullable: true })
	@IsEnum(EventCategory)
	eventCategory?: EventCategory;

	@IsOptional()
	@Field(() => Float, { nullable: true })
	@IsNumber()
	@Min(0)
	eventPrice?: number;

	@IsOptional()
	@Field(() => EventCurrency, { nullable: true })
	@IsEnum(EventCurrency)
	eventCurrency?: EventCurrency;

	@IsOptional()
	@Field(() => EventLocationUpdateInput, { nullable: true })
	@ValidateNested()
	@Type(() => EventLocationUpdateInput)
	eventLocation?: EventLocationUpdateInput;

	@IsOptional()
	@Field(() => EventScheduleUpdateInput, { nullable: true })
	@ValidateNested()
	@Type(() => EventScheduleUpdateInput)
	eventSchedule?: EventScheduleUpdateInput;

	@IsOptional()
	@Field(() => EventPeriodUpdateInput, { nullable: true })
	@ValidateNested()
	@Type(() => EventPeriodUpdateInput)
	eventPeriod?: EventPeriodUpdateInput;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	@IsDateString()
	eventRegistrationDeadline?: Date;

	@IsOptional()
	@Field(() => EventContactUpdateInput, { nullable: true })
	@ValidateNested()
	@Type(() => EventContactUpdateInput)
	eventContact?: EventContactUpdateInput;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	eventImages?: string[];

	@IsOptional()
	@Field(() => EventAvailabilityStatus, { nullable: true })
	@IsEnum(EventAvailabilityStatus)
	eventAvailabilityStatus?: EventAvailabilityStatus;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	@IsNumber()
	@Min(0)
	eventCapacity?: number;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	@IsNumber()
	@Min(1)
	eventDurationMinutes?: number;

	@IsOptional()
	@Field(() => EventRequirementsUpdateInput, { nullable: true })
	@ValidateNested()
	@Type(() => EventRequirementsUpdateInput)
	eventRequirements?: EventRequirementsUpdateInput;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(1000)
	eventNotes?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsString()
	@MaxLength(1000)
	eventCancellationPolicy?: string;
}
