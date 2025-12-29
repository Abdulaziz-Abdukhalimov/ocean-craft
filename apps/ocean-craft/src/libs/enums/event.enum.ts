import { registerEnumType } from '@nestjs/graphql';

export enum EventCategory {
	YACHT_TOUR = 'YACHT_TOUR',
	JETSKI_RENTAL = 'JETSKI_RENTAL',
	SURFING = 'SURFING',
	DIVING = 'DIVING',
}
registerEnumType(EventCategory, {
	name: 'EventCategory',
});

export enum EventCurrency {
	USD = 'USD',
	KRW = 'KRW',
	EUR = 'EUR',
}
registerEnumType(EventCurrency, {
	name: 'EventCurrency',
});

export enum EventAvailabilityStatus {
	AVAILABLE = 'AVAILABLE',
	LIMITED = 'LIMITED',
	FULL = 'FULL',
}
registerEnumType(EventAvailabilityStatus, {
	name: 'EventAvailabilityStatus',
});

export enum EventStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	ACTIVE = 'ACTIVE',
	CANCELLED = 'CANCELLED',
	COMPLETED = 'COMPLETED',
	CONFIRMED = 'CONFIRMED',
	DELETED = 'DELETED',
}
registerEnumType(EventStatus, {
	name: 'EventStatus',
});

export enum EventScheduleType {
	RECURRING = 'RECURRING',
	ONE_TIME = 'ONE_TIME',
}
registerEnumType(EventScheduleType, {
	name: 'EventScheduleType',
});

export enum EventDayOfWeek {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY',
}
registerEnumType(EventDayOfWeek, {
	name: 'EventDayOfWeek',
});

export enum EventExperienceLevel {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
	ALL_LEVELS = 'ALL_LEVELS',
}
registerEnumType(EventExperienceLevel, {
	name: 'EventExperienceLevel',
});

export enum PaymentMethod {
	CASH = 'CASH',
	CARD = 'CARD',
}
registerEnumType(PaymentMethod, {
	name: 'PaymentMethod',
});

export enum PaymentStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
}
registerEnumType(PaymentStatus, {
	name: 'PaymentStatus',
});
