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

// Nested Update Input Types (all optional)
@InputType()
class MultiLanguageUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(200)
	ko?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(200)
	en?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(200)
	uz?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(200)
	ru?: string;
}

@InputType()
class MultiLanguageDescriptionUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(2000)
	ko?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(2000)
	en?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(2000)
	uz?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(2000)
	ru?: string;
}

@InputType()
class EventLocationUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(100)
	city?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	address?: string;
}

@InputType()
class EventTimeSlotUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	startTime?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	endTime?: string;
}

@InputType()
class EventSpecificDateUpdateInput {
	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDateString()
	date?: Date;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	startTime?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
		message: 'Time must be in HH:MM format (e.g., 09:00, 14:30)',
	})
	endTime?: string;
}

@InputType()
class EventScheduleUpdateInput {
	@Field(() => EventScheduleType, { nullable: true })
	@IsOptional()
	@IsEnum(EventScheduleType)
	type?: EventScheduleType;

	@Field(() => [EventDayOfWeek], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsEnum(EventDayOfWeek, { each: true })
	daysOfWeek?: EventDayOfWeek[];

	@Field(() => [EventTimeSlotUpdateInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EventTimeSlotUpdateInput)
	timeSlots?: EventTimeSlotUpdateInput[];

	@Field(() => [EventSpecificDateUpdateInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EventSpecificDateUpdateInput)
	specificDates?: EventSpecificDateUpdateInput[];
}

@InputType()
class EventPeriodUpdateInput {
	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDateString()
	endDate?: Date;
}

@InputType()
class EventContactUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(20)
	phone?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsEmail()
	@MaxLength(100)
	email?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(50)
	telegram?: string;
}

@InputType()
class EventRequirementsUpdateInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	minAge?: number;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	maxAge?: number;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@MaxLength(100, { each: true })
	bringItems?: string[];

	@Field(() => EventExperienceLevel, { nullable: true })
	@IsOptional()
	@IsEnum(EventExperienceLevel)
	experienceLevel?: EventExperienceLevel;
}

@InputType()
class MultiLanguageNotesUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	ko?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	en?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	uz?: string;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	ru?: string;
}

// Main Update Event Input (all fields optional)
@InputType()
export class EventUpdate {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	_id: ObjectId;

	@Field(() => MultiLanguageUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => MultiLanguageUpdateInput)
	eventTitle?: MultiLanguageUpdateInput;

	@Field(() => MultiLanguageDescriptionUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => MultiLanguageDescriptionUpdateInput)
	eventDescription?: MultiLanguageDescriptionUpdateInput;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(400)
	businessName?: string;

	@Field(() => EventCategory, { nullable: true })
	@IsOptional()
	@IsEnum(EventCategory)
	eventCategory?: EventCategory;

	@Field(() => Float, { nullable: true })
	@IsOptional()
	@IsNumber()
	@Min(0)
	eventPrice?: number;

	@Field(() => EventCurrency, { nullable: true })
	@IsOptional()
	@IsEnum(EventCurrency)
	eventCurrency?: EventCurrency;

	@Field(() => EventLocationUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => EventLocationUpdateInput)
	eventLocation?: EventLocationUpdateInput;

	@Field(() => EventScheduleUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => EventScheduleUpdateInput)
	eventSchedule?: EventScheduleUpdateInput;

	@Field(() => EventPeriodUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => EventPeriodUpdateInput)
	eventPeriod?: EventPeriodUpdateInput;

	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDateString()
	eventRegistrationDeadline?: Date;

	@Field(() => EventContactUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => EventContactUpdateInput)
	eventContact?: EventContactUpdateInput;

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@IsString({ each: true })
	eventImages?: string[];

	@Field(() => EventAvailabilityStatus, { nullable: true })
	@IsOptional()
	@IsEnum(EventAvailabilityStatus)
	eventAvailabilityStatus?: EventAvailabilityStatus;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber()
	@Min(0)
	eventCapacity?: number;

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsNumber()
	@Min(1)
	eventDurationMinutes?: number;

	@Field(() => EventRequirementsUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => EventRequirementsUpdateInput)
	eventRequirements?: EventRequirementsUpdateInput;

	@Field(() => MultiLanguageNotesUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => MultiLanguageNotesUpdateInput)
	eventNotes?: MultiLanguageNotesUpdateInput;

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(1000)
	eventCancellationPolicy?: string;
}
