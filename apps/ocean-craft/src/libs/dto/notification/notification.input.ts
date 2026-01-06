import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, IsIn, Min } from 'class-validator';
import { NotificationStatus, NotificationType, NotificationGroup } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class NotificationInquiry {
	@Field(() => Int, { defaultValue: 1 })
	@Min(1)
	page: number;

	@Field(() => Int)
	@Min(1)
	limit: number;

	@IsOptional()
	@IsIn(Object.values(NotificationStatus))
	@Field(() => String, { nullable: true })
	notificationStatus?: NotificationStatus;
}

@InputType()
export class CreateNotificationInput {
	@Field(() => String)
	receiverId: ObjectId;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => String)
	notificationType: NotificationType;

	@Field(() => String)
	notificationGroup: NotificationGroup;

	@Field(() => String)
	notificationTitle: string;

	@Field(() => String, { nullable: true })
	notificationDesc?: string;

	@Field(() => String, { nullable: true })
	notifRefId?: ObjectId;
}
