import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { InquiryService } from './inquiry.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import {
	CreateInquiryInput,
	InquiriesInput,
	ReplyInquiryInput,
	UpdateInquiryStatusInput,
} from '../../libs/dto/inquiry/inquiry.input';
import { GraphQLInt } from 'graphql';
import { InquiriesResponse, Inquiry } from '../../libs/dto/inquiry/inquiry';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Reservation } from '../../libs/dto/reservation/reservation';

@Resolver()
export class InquiryResolver {
	constructor(private readonly inquiryService: InquiryService) {}

	// BUYER
	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async createInquiry(
		@Args('input') input: CreateInquiryInput,
		@AuthMember('_id') buyerId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: createInquiry');
		return await this.inquiryService.createInquiry(buyerId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => InquiriesResponse)
	public async getMyInquiries(
		@Args('input') input: InquiriesInput,
		@AuthMember('_id') buyerId: ObjectId,
	): Promise<InquiriesResponse> {
		console.log('Query: getMyInquiries');
		return await this.inquiryService.getMyInquiries(buyerId, input);
	}

	// SELLER:
	@UseGuards(AuthGuard)
	@Query(() => InquiriesResponse)
	public async getReceivedInquiries(
		@Args('input') input: InquiriesInput,
		@AuthMember('_id') sellerId: ObjectId,
	): Promise<InquiriesResponse> {
		console.log('Query: getReceivedInquiries');
		return await this.inquiryService.getReceivedInquiries(sellerId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async markInquiryAsViewed(
		@Args('inquiryId') inquiryId: String,
		@AuthMember('_id') sellerId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: markInquiryAsViewed');
		return await this.inquiryService.markAsViewed(sellerId, shapeIntoMongoObjectId(inquiryId));
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async replyToInquiry(
		@Args('input') input: ReplyInquiryInput,
		@AuthMember('_id') sellerId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: replyToInquiry');
		return await this.inquiryService.replyToInquiry(sellerId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async updateInquiryStatus(
		@Args('input') input: UpdateInquiryStatusInput,
		@AuthMember('_id') sellerId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: updateInquiryStatus');
		return await this.inquiryService.updateInquiryStatus(sellerId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Inquiry)
	public async getInquiry(
		@Args('inquiryId') inquiryId: String,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Query: getInquiry');
		return await this.inquiryService.getInquiry(memberId, shapeIntoMongoObjectId(inquiryId));
	}

	@UseGuards(AuthGuard)
	@Query(() => GraphQLInt)
	public async getUnreadInquiryCount(@AuthMember('_id') sellerId: ObjectId): Promise<number> {
		console.log('Query: getUnreadInquiryCount');
		return await this.inquiryService.getUnreadCount(sellerId);
	}
}
