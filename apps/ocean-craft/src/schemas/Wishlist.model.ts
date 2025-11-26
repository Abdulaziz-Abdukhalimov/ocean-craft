import { Schema } from 'mongoose';
import { ItemType } from '../libs/enums/wishlist.enum';

const WishlistSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
		itemType: {
			type: String,
			required: true,
			enum: ItemType,
		},
		itemId: {
			type: Schema.Types.ObjectId,
			required: true,
			refPath: 'itemType',
		},
	},
	{ timestamps: true, collection: 'wishlists' },
);

WishlistSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });
WishlistSchema.index({ userId: 1, createdAt: -1 });
WishlistSchema.index({ itemType: 1, itemId: 1 }); // For counting wishlists

export default WishlistSchema;
