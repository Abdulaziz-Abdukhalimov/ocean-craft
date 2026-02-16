import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { LikeGroup } from '../../enums/like.enum';
import { Type } from 'class-transformer';

@InputType()
export class LikeInput {
	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	likeRefId: ObjectId;

	@IsNotEmpty()
	@Field(() => LikeGroup)
	likeGroup: LikeGroup;
}

@InputType()
export class AllFavoritesInquiry {
	@Field(() => Int)
	@IsInt()
	@Min(1)
	@Type(() => Number)
	page: number;

	@Field(() => Int)
	@IsInt()
	@Min(1)
	@Type(() => Number)
	limit: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	likeGroup?: LikeGroup;
}
