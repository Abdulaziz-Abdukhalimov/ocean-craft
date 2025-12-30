import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { InquiryStatus, PreferredContactMethod } from '../../enums/productInquiry.enum';
import { ContactPerson } from '../reservation/reservation';
import { TotalCounter } from '../member/member';

// @ObjectType()
// export class ContactPerson {
// 	@Field(() => String)
// 	fullName: string;

// 	@Field(() => String)
// 	email: string;

// 	@Field(() => String)
// 	phone: string;
// }

@ObjectType()
export class Inquiry {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	buyerId: ObjectId;

	@Field(() => String)
	sellerId: ObjectId;

	@Field(() => String)
	productId: ObjectId;

	@Field(() => ContactPerson)
	contactPerson: ContactPerson;

	@Field(() => String)
	inquiryMessage: string;

	@Field(() => String)
	preferredContactMethod: PreferredContactMethod;

	@Field(() => String, { nullable: true })
	sellerReply?: string;

	@Field(() => String)
	status: InquiryStatus;

	@Field(() => Boolean)
	isRead: boolean;

	@Field(() => Date, { nullable: true })
	viewedAt?: Date;

	@Field(() => Date, { nullable: true })
	respondedAt?: Date;

	@Field(() => Date, { nullable: true })
	closedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

// @ObjectType()
// export class TotalCounter {
// 	@Field(() => Int)
// 	total: number;
// }

@ObjectType()
export class InquiriesResponse {
	@Field(() => [Inquiry])
	list: Inquiry[];

	@Field(() => TotalCounter)
	metaCounter: TotalCounter;
}

@ObjectType()
export class InquiryResponse {
	@Field(() => Inquiry, { nullable: true })
	data?: Inquiry;

	@Field(() => String, { nullable: true })
	message?: string;
}
