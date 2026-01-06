import {
	Injectable,
	BadRequestException,
	NotFoundException,
	ForbiddenException,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateInquiryInput, InquiriesInput } from '../../libs/dto/inquiry/inquiry.input';
import { ReplyInquiryInput } from '../../libs/dto/inquiry/inquiry.input';
import { UpdateInquiryStatusInput } from '../../libs/dto/inquiry/inquiry.input';
import { lookupAuthMemberLiked, lookupMember, lookupMember1, lookupProduct } from '../../libs/config';
import { InquiriesResponse, Inquiry } from '../../libs/dto/inquiry/inquiry';
import { Product } from '../../libs/dto/product/product';
import { Message } from '../../libs/enums/common.enum';
import { InquiryStatus } from '../../libs/enums/productInquiry.enum';
import { NotificationService } from '../notification/notification.service';
import { NotificationGroup, NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class InquiryService {
	constructor(
		@InjectModel('Inquiry') private readonly inquiryModel: Model<Inquiry>,
		@InjectModel('Product') private readonly productModel: Model<Product>,
		private readonly notificationService: NotificationService,
	) {}

	// BUYER:
	public async createInquiry(buyerId: ObjectId, input: CreateInquiryInput): Promise<Inquiry> {
		try {
			const { productId, contactPerson, inquiryMessage, preferredContactMethod } = input;

			const product = await this.productModel.findOne({ _id: productId });

			if (!product) {
				throw new NotFoundException(Message.NO_DATA_FOUND);
			}

			const inquiry = await this.inquiryModel.create({
				buyerId,
				sellerId: product.memberId,
				productId,
				contactPerson,
				inquiryMessage,
				preferredContactMethod: preferredContactMethod || 'ANY',
				status: InquiryStatus.PENDING,
				isRead: false,
			});

			await this.notificationService.createNotification({
				receiverId: product.memberId,
				authorId: buyerId,
				notificationType: NotificationType.PRODUCT_INQUIRY,
				notificationGroup: NotificationGroup.INQUIRY,
				notificationTitle: `New inquiry about "${product.productTitle}"`,
				notificationDesc: inquiryMessage.substring(0, 100),
				notifRefId: inquiry._id,
			});

			return inquiry;
		} catch (error) {
			console.error('Error creating inquiry:', error);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getMyInquiries(buyerId: ObjectId, input: InquiriesInput): Promise<InquiriesResponse> {
		try {
			const { page, limit, filter } = input;
			const skip = (page - 1) * limit;

			const match: any = { buyerId };

			if (filter?.status) {
				match.status = filter.status;
			}

			if (filter?.productId) {
				match.productId = filter.productId;
			}

			const result = await this.inquiryModel
				.aggregate([
					{ $match: match },
					{ $sort: { createdAt: -1 } },
					{
						$facet: {
							list: [{ $skip: skip }, { $limit: limit }],
							metaCounter: [{ $count: 'total' }],
						},
					},
					lookupProduct,
					lookupMember1,
				])
				.exec();

			if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

			return {
				list: result[0].list,
				metaCounter: { total: result[0].metaCounter[0]?.total || 0 },
			};
		} catch (error) {
			console.error('Error getting my inquiries:', error);
			throw error;
		}
	}

	// SELLER:
	public async getReceivedInquiries(sellerId: ObjectId, input: InquiriesInput): Promise<InquiriesResponse> {
		try {
			const { page, limit, filter } = input;
			const skip = (page - 1) * limit;

			const match: any = { sellerId };

			if (filter?.status) {
				match.status = filter.status;
			}

			if (filter?.productId) {
				match.productId = filter.productId;
			}

			if (filter?.isRead !== undefined) {
				match.isRead = filter.isRead;
			}

			const result = await this.inquiryModel
				.aggregate([
					{ $match: match },
					{ $sort: { createdAt: -1 } },
					lookupProduct,
					lookupMember,
					{
						$facet: {
							list: [{ $skip: skip }, { $limit: limit }],
							metaCounter: [{ $count: 'total' }],
						},
					},
				])
				.exec();

			if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

			return {
				list: result[0].list,
				metaCounter: { total: result[0].metaCounter[0]?.total || 0 },
			};
		} catch (error) {
			console.error('Error getting received inquiries:', error);
			throw error;
		}
	}

	public async markAsViewed(sellerId: ObjectId, inquiryId: ObjectId): Promise<any> {
		try {
			const inquiry = await this.inquiryModel.findOne({ _id: inquiryId, sellerId });

			if (!inquiry) {
				throw new NotFoundException('Inquiry not found');
			}

			const updated = await this.inquiryModel.findByIdAndUpdate(
				inquiryId,
				{
					status: InquiryStatus.VIEWED,
					isRead: true,
					viewedAt: new Date(),
				},
				{ new: true },
			);

			return updated;
		} catch (error) {
			console.error('Error marking inquiry as viewed:', error);
			throw error;
		}
	}

	public async replyToInquiry(sellerId: ObjectId, input: ReplyInquiryInput): Promise<any> {
		try {
			const { inquiryId, sellerReply } = input;

			const inquiry = await this.inquiryModel.findOne({ _id: inquiryId, sellerId });

			if (!inquiry) {
				throw new NotFoundException('Inquiry not found');
			}

			const updated = await this.inquiryModel.findByIdAndUpdate(
				inquiryId,
				{
					sellerReply,
					status: InquiryStatus.RESPONDED,
					respondedAt: new Date(),
					isRead: true,
				},
				{ new: true },
			);

			// TODO: Send email notification to buyer

			return updated;
		} catch (error) {
			console.error('Error replying to inquiry:', error);
			throw error;
		}
	}

	public async updateInquiryStatus(sellerId: ObjectId, input: UpdateInquiryStatusInput): Promise<any> {
		try {
			const { inquiryId } = input;

			const inquiry = await this.inquiryModel.findOne({ _id: inquiryId, sellerId });

			if (!inquiry) {
				throw new NotFoundException('Inquiry not found');
			}

			const updated = await this.inquiryModel.findByIdAndUpdate(
				inquiryId,
				{
					status: InquiryStatus.CLOSED,
					closedAt: new Date(),
				},
				{ new: true },
			);

			return updated;
		} catch (error) {
			console.error('Error updating inquiry status:', error);
			throw error;
		}
	}

	public async getInquiry(memberId: ObjectId, inquiryId: ObjectId): Promise<any> {
		try {
			const inquiry = await this.inquiryModel
				.findOne({
					_id: inquiryId,
					$or: [{ buyerId: memberId }, { sellerId: memberId }],
				})
				.populate('productId')
				.populate('buyerId')
				.populate('sellerId')
				.exec();

			if (!inquiry) {
				throw new NotFoundException('Inquiry not found');
			}

			return inquiry;
		} catch (error) {
			console.error('Error getting inquiry:', error);
			throw error;
		}
	}

	public async getUnreadCount(sellerId: ObjectId): Promise<number> {
		try {
			const count = await this.inquiryModel.countDocuments({
				sellerId,
				isRead: false,
			});

			return count;
		} catch (error) {
			console.error('Error getting unread count:', error);
			throw error;
		}
	}
}
