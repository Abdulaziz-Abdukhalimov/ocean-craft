import { Schema } from 'mongoose';
import { InquiryStatus, PreferredContactMethod } from '../libs/enums/productInquiry.enum';

const InquirySchema = new Schema(
	{
		buyerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		// Seller
		sellerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		productId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Product',
		},

		contactPerson: {
			fullName: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			phone: {
				type: String,
				required: true,
			},
		},

		inquiryMessage: {
			type: String,
			required: true,
			maxlength: 2000,
		},
		preferredContactMethod: {
			type: String,
			enum: PreferredContactMethod,
			default: PreferredContactMethod.ANY,
		},

		sellerReply: {
			type: String,
			maxlength: 2000,
		},

		status: {
			type: String,
			enum: InquiryStatus,
			default: InquiryStatus.PENDING,
		},

		isRead: {
			type: Boolean,
			default: false,
		},

		viewedAt: {
			type: Date,
		},

		respondedAt: {
			type: Date,
		},

		closedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		collection: 'inquiries',
	},
);

InquirySchema.index({ sellerId: 1, status: 1, createdAt: -1 });
InquirySchema.index({ sellerId: 1, isRead: 1, createdAt: -1 });
InquirySchema.index({ buyerId: 1, createdAt: -1 });
InquirySchema.index({ productId: 1, createdAt: -1 });

export default InquirySchema;
