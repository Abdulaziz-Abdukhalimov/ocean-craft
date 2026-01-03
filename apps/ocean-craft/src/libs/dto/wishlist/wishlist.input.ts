import { Field, InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, Length } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ItemType } from '../../enums/wishlist.enum';

@InputType()
export class WishlistInput {
	@IsNotEmpty()
	@Field(() => String)
	itemType: ItemType;

	@IsNotEmpty()
	@Length(24, 24)
	@Field(() => String)
	itemId: ObjectId;
}

@InputType()
export class WishlistInquiry {
	@IsNotEmpty()
	@Field(() => String)
	@IsIn(Object.values(ItemType))
	itemType: ItemType;

	@Field(() => Number, { defaultValue: 1 })
	page: number;

	@Field(() => Number, { defaultValue: 12 })
	limit: number;
}
