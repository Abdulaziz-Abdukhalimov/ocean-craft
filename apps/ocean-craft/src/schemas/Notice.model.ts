import mongoose, { Schema } from 'mongoose';
import { NoticeStatus, NoticeType } from '../libs/enums/faqNotice.enum';

const NoticeSchema = new Schema(
	{
		noticeType: {
			type: String,
			enum: NoticeType,
			required: true,
		},

		noticeStatus: {
			type: String,
			enum: NoticeStatus,
			default: NoticeStatus.ACTIVE,
		},

		noticeTitle: {
			type: String,
			required: true,
		},

		noticeContent: {
			type: String,
			required: true,
		},

		authorId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
		blockedAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'notices' },
);

export default NoticeSchema;
