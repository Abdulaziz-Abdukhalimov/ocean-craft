import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { NotificationInquiry, CreateNotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationType, NotificationGroup, NotificationStatus } from '../../libs/enums/notification.enum';
import { Notification, NotificationsResponse } from '../../libs/dto/notification/notification';
import { Product } from '../../libs/dto/product/product';
import { Event } from '../../libs/dto/event/event';
import { NotificationGateway } from '../../socket/notification.gateway';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notification') private readonly notificationModel: Model<Notification>,
		@InjectModel('Product') private readonly productModel: Model<Product>,
		@InjectModel('Event') private readonly eventModel: Model<Event>,
		private readonly notificationGateway: NotificationGateway,
	) {}

	public async createNotification(input: CreateNotificationInput): Promise<Notification> {
		try {
			if (input.receiverId.toString() === input.authorId.toString()) {
				return null;
			}

			const notification = await this.notificationModel.create(input);

			// SOCKET.IO: Send real-time notification to user
			this.notificationGateway.sendNotificationToUser(input.receiverId.toString(), notification);

			console.log(`✅ Notification created and sent via Socket.IO to user ${input.receiverId}`);

			return notification;
		} catch (err) {
			console.log('Error creating notification:', err);
			return null;
		}
	}

	public async getMyNotifications(receiverId: ObjectId, input: NotificationInquiry): Promise<NotificationsResponse> {
		const { page, limit, notificationStatus } = input;
		const match: any = { receiverId };

		if (notificationStatus) {
			match.notificationStatus = notificationStatus;
		}

		const notifications = await this.notificationModel.aggregate([
			{ $match: match },
			{ $sort: { createdAt: -1 } },
			{ $skip: (page - 1) * limit },
			{ $limit: limit },
			{
				$lookup: {
					from: 'members',
					localField: 'authorId',
					foreignField: '_id',
					as: 'authorData',
				},
			},
			{ $unwind: { path: '$authorData', preserveNullAndEmptyArrays: true } },
			{
				$project: {
					_id: 1,
					notificationType: 1,
					notificationStatus: 1,
					notificationGroup: 1,
					notificationTitle: 1,
					notificationDesc: 1,
					authorId: 1,
					receiverId: 1,
					notifRefId: 1,
					readAt: 1,
					createdAt: 1,
					updatedAt: 1,
					'authorData._id': 1,
					'authorData.memberNick': 1,
					'authorData.memberImage': 1,
					'authorData.memberPhone': 1,
					'authorData.memberType': 1,
				},
			},
		]);

		// Populate product/event data
		const populatedNotifications = await Promise.all(
			notifications.map(async (notif: any) => {
				if (notif.notificationGroup === NotificationGroup.PRODUCT && notif.notifRefId) {
					const product = await this.productModel
						.findById(notif.notifRefId)
						.select('productTitle productImages productPrice memberId')
						.lean();
					notif.productData = product;
				}

				if (notif.notificationGroup === NotificationGroup.EVENT && notif.notifRefId) {
					const event = await this.eventModel
						.findById(notif.notifRefId)
						.select('eventTitle eventImages eventPrice memberId')
						.lean();
					notif.eventData = event;
				}

				return notif;
			}),
		);

		const total = await this.notificationModel.countDocuments(match);

		return {
			list: populatedNotifications as any,
			metaCounter: [{ total }],
		};
	}

	public async markAsRead(notificationId: ObjectId, receiverId: ObjectId): Promise<boolean> {
		const result = await this.notificationModel.updateOne(
			{ _id: notificationId, receiverId },
			{
				$set: {
					notificationStatus: NotificationStatus.READ,
					readAt: new Date(),
				},
			},
		);

		return result.modifiedCount > 0;
	}

	public async markAllAsRead(receiverId: ObjectId): Promise<number> {
		const result = await this.notificationModel.updateMany(
			{ receiverId, notificationStatus: NotificationStatus.WAIT },
			{
				$set: {
					notificationStatus: NotificationStatus.READ,
					readAt: new Date(),
				},
			},
		);

		return result.modifiedCount;
	}

	public async getUnreadCount(receiverId: ObjectId): Promise<number> {
		return await this.notificationModel.countDocuments({
			receiverId,
			notificationStatus: NotificationStatus.WAIT,
		});
	}

	public async deleteNotification(notificationId: ObjectId, receiverId: ObjectId): Promise<boolean> {
		const result = await this.notificationModel.deleteOne({
			_id: notificationId,
			receiverId,
		});

		return result.deletedCount > 0;
	}
}
