import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsEmail, IsNotEmpty, IsEnum, IsOptional, IsMongoId, MaxLength, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';
import { InquiryStatus, PreferredContactMethod } from '../../enums/productInquiry.enum';

@InputType()
export class ContactPersonInput {
	@IsNotEmpty()
	@Field(() => String)
	@IsString()
	fullName: string;

	@IsNotEmpty()
	@Field(() => String)
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Field(() => String)
	@IsString()
	phone: string;
}

@InputType()
export class CreateInquiryInput {
	@Field(() => String)
	productId: ObjectId;

	@IsNotEmpty()
	@Field(() => ContactPersonInput)
	contactPerson: ContactPersonInput;

	@IsNotEmpty()
	@Field(() => String)
	@IsString()
	@MaxLength(2000)
	inquiryMessage: string;

	@IsOptional()
	@Field(() => String, { defaultValue: PreferredContactMethod.ANY })
	@IsEnum(PreferredContactMethod)
	preferredContactMethod?: PreferredContactMethod;
}

@InputType()
export class ReplyInquiryInput {
	@Field(() => String)
	inquiryId: string;

	@IsNotEmpty()
	@Field(() => String)
	@IsString()
	@MaxLength(2000)
	sellerReply: string;
}

@InputType()
export class UpdateInquiryStatusInput {
	@Field(() => String)
	inquiryId: string;
}

@InputType()
export class InquiryFilter {
	@IsOptional()
	@Field(() => String, { nullable: true })
	@IsEnum(InquiryStatus)
	status?: InquiryStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	productId?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	@IsBoolean()
	isRead?: boolean;
}

@InputType()
export class InquiriesInput {
	@Field(() => Number, { defaultValue: 1 })
	page: number;

	@Field(() => Number, { defaultValue: 10 })
	limit: number;

	@Field(() => InquiryFilter, { nullable: true })
	filter?: InquiryFilter;
}
