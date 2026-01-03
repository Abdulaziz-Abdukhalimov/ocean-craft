import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { ItemType } from '../../enums/wishlist.enum';
import { Product } from '../product/product';
import { Event } from '../event/event';
import { TotalCounter } from '../member/member';

@ObjectType()
export class Wishlist {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	itemType: ItemType;

	@Field(() => String)
	itemId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	// from aggregation - populated data
	@Field(() => Product, { nullable: true })
	productData?: Product;

	@Field(() => Event, { nullable: true })
	eventData?: Event;
}

@ObjectType()
export class Wishlists {
	@Field(() => [Wishlist])
	list: Wishlist[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
