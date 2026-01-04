import { Field, ObjectType } from '@nestjs/graphql';
import { LikeGroup } from '../../enums/like.enum';
import { ObjectId } from 'mongoose';
import { Product } from '../product/product';
import { Event } from '../event/event';
import { TotalCounter } from '../member/member';

@ObjectType()
export class MeLiked {
	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	likeRefId: ObjectId;

	@Field(() => Boolean)
	myFavorite: boolean;
}

@ObjectType()
export class Like {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => LikeGroup)
	likeGroup: LikeGroup;

	@Field(() => String)
	likeRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}

@ObjectType()
export class FavoriteItem {
	@Field(() => String)
	_id: string;

	@Field(() => String)
	itemType: string;

	@Field(() => String)
	likeRefId: string;

	@Field(() => Product, { nullable: true })
	productData?: Product;

	@Field(() => Event, { nullable: true })
	eventData?: Event;

	@Field(() => Date)
	createdAt: Date;
}

@ObjectType()
export class AllFavorites {
	@Field(() => [FavoriteItem])
	list: FavoriteItem[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
