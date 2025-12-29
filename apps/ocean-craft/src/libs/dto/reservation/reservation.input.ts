import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';
import { PaymentMethod } from '../../enums/event.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateReservationInput {
	@Field(() => String)
	@IsNotEmpty()
	eventId: string;

	@Field(() => String)
	@IsNotEmpty()
	date: string;

	@Field(() => Number)
	@Min(1)
	numberOfPeople: number;

	@Field(() => String)
	@Length(5, 100)
	@IsNotEmpty()
	fullName: string;

	@Field(() => String)
	@IsEmail()
	email: string;

	@Field(() => String)
	@IsNotEmpty()
	phone: string;

	@Field(() => PaymentMethod)
	@IsEnum(PaymentMethod)
	paymentMethod: PaymentMethod;
}
