import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationType, NotificationStatus, NotificationGroup } from '../../enums/notification.enum';
import { Member, TotalCounter } from '../member/member';
import { Product } from '../product/product';
import { Event } from '../event/event';

@ObjectType()
export class Notification {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	notificationType: NotificationType;

	@Field(() => String)
	notificationStatus: NotificationStatus;

	@Field(() => String)
	notificationGroup: NotificationGroup;

	@Field(() => String)
	notificationTitle: string;

	@Field(() => String, { nullable: true })
	notificationDesc?: string;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String, { nullable: true })
	productId?: ObjectId;

	@Field(() => String, { nullable: true })
	eventId?: ObjectId;

	@Field(() => String, { nullable: true })
	inquiryId?: ObjectId;

	@Field(() => Date, { nullable: true })
	readAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	// Populated fields
	@Field(() => Member, { nullable: true })
	authorData?: Member;

	@Field(() => Product, { nullable: true })
	productData?: Product;

	@Field(() => Event, { nullable: true })
	eventData?: Event;
}

@ObjectType()
export class NotificationsResponse {
	@Field(() => [Notification])
	list: Notification[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

@ObjectType()
export class NotificationActionResponse {
	@Field(() => Boolean)
	success: boolean;

	@Field(() => String, { nullable: true })
	message?: string;
}
