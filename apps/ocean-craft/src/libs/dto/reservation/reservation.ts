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
export class PaymentInfoResponse {
	@Field(() => String)
	cardholderName: string;

	@Field(() => String)
	cardLastFour: string;
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

	@Field(() => PaymentInfoResponse, { nullable: true })
	paymentInfo?: PaymentInfoResponse;

	@Field(() => PaymentStatus)
	paymentStatus: PaymentStatus;

	@Field(() => Date, { nullable: true })
	paymentProcessedAt?: Date;

	@Field(() => EventStatus)
	status: EventStatus;

	@Field(() => String)
	bookingReference: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
