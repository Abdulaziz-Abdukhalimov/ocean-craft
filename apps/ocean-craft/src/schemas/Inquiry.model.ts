import { Schema } from 'mongoose';
import { InquiryItemType } from '../libs/enums/product.enum';

const InquirySchema = new Schema(
	{
		// Buyer Information
		buyerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		// Seller/Business Information
		sellerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		// Item Type (Product or Event)
		itemType: {
			type: String,
			enum: InquiryItemType,
			required: true,
		},

		//  Item ID (references Product OR Event dynamically)
		itemId: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: 'itemType', // Dynamic reference!
		},

		// Inquiry Message
		inquiryMessage: {
			type: String,
			required: true,
			maxlength: 2000,
		},

		// Read Status
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		collection: 'inquiries',
	},
);

// Seller's unread inquiries
InquirySchema.index({ sellerId: 1, isRead: 1, createdAt: -1 });

// Buyer's inquiries
InquirySchema.index({ buyerId: 1, createdAt: -1 });

// Item inquiries (works for both products and events)
InquirySchema.index({ itemType: 1, itemId: 1, createdAt: -1 });

export default InquirySchema;
