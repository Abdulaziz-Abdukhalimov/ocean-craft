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
