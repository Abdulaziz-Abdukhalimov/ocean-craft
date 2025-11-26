import { Schema } from 'mongoose';
import { FaqCategory, FaqStatus } from '../libs/enums/faqNotice.enum';

const FaqSchema = new Schema(
	{
		// FAQ Category
		faqCategory: {
			type: String,
			enum: FaqCategory,
			required: true,
		},

		faqQuestion: {
			type: String,
			required: true,
		},

		// Answer (Multilingual)
		faqAnswer: {
			type: String,
			required: true,
		},

		// Admin who created/edited
		authorId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		// Status
		faqStatus: {
			type: String,
			enum: FaqStatus,
			default: FaqStatus.ACTIVE,
		},

		// Status Change Timestamps
		blockedAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		collection: 'faqs',
	},
);

// Admin queries by status
FaqSchema.index({ faqStatus: 1, createdAt: -1 });

// User queries by category and status
FaqSchema.index({ faqCategory: 1, faqStatus: 1, faqOrder: 1 });

// Popular FAQs
FaqSchema.index({ faqStatus: 1, faqViews: -1 });

export default FaqSchema;
