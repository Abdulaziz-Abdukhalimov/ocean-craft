import { ObjectType, Field } from '@nestjs/graphql';
import { EventStatus, PaymentMethod, PaymentStatus } from '../../enums/event.enum';

@ObjectType()
export class ContactPerson {
	@Field(() => String)
	fullName: string;

	@Field(() => String)
	email: string;

	@Field(() => String)
	phone: string;
}

@ObjectType()
export class Reservation {
	@Field(() => String)
	_id: string;

	@Field(() => String)
	eventId: string;

	@Field(() => String)
	slotId: string;

	@Field(() => String)
	memberId: string;

	@Field(() => Date)
	reservationDate: Date;

	@Field(() => Number)
	numberOfPeople: number;

	@Field(() => ContactPerson)
	contactPerson: ContactPerson;

	@Field(() => Number)
	pricePerPerson: number;

	@Field(() => Number)
	totalAmount: number;

	@Field(() => PaymentMethod)
	paymentMethod: PaymentMethod;

	@Field(() => PaymentStatus)
	paymentStatus: PaymentStatus;

	@Field(() => EventStatus)
	status: EventStatus;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
