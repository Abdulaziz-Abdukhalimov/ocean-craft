import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { BusinessEventsInquiry, EventCreate, Events } from '../../libs/dto/event/event.input';
import { Member } from '../../libs/dto/member/member';
import { Direction, Message } from '../../libs/enums/common.enum';
import { EventStatus } from '../../libs/enums/event.enum';
import { Event } from '../../libs/dto/event/event';
import { EventUpdate } from '../../libs/dto/event/event.update';
import { T } from '../../libs/types/common';
import { lookupMember, lookupMember1 } from '../../libs/config';

@Injectable()
export class EventService {
	constructor(
		@InjectModel('Event') private readonly eventModel: Model<Event>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	//seller services
	public async createEvent(memberId: ObjectId, input: EventCreate): Promise<Event> {
		try {
			input.businessId = memberId;

			// Get business name from member
			const member: Member = await this.memberModel.findById(memberId);
			if (!member) throw new BadRequestException(Message.NO_DATA_FOUND);

			const newEvent = await this.eventModel.create({
				...input,
				eventStatus: EventStatus.PENDING,
			});

			return newEvent;
		} catch (err) {
			console.log('Error: service-createEvent:', err.message);
			throw new BadRequestException(err.message);
		}
	}

	public async updateEvent(memberId: ObjectId, input: EventUpdate): Promise<Event> {
		try {
			const { _id, ...updateData } = input;

			// Check ownership
			const event = await this.eventModel.findOne({
				_id,
				businessId: memberId,
				deletedAt: null,
			});

			if (!event) throw new BadRequestException(Message.NO_DATA_FOUND);

			const updateFields: any = { ...updateData };
			// If updating after approval, set back to pending
			if (event.eventStatus === EventStatus.APPROVED && Object.keys(updateData).length > 0) {
				updateFields.eventStatus = EventStatus.PENDING;
				updateFields.approvedAt = null;
			}

			const result = await this.eventModel.findByIdAndUpdate(_id, updateFields, { new: true }).exec();

			if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

			return result;
		} catch (err) {
			console.log('Error, Service.updateEvent:', err.message);
			throw new BadRequestException(err.message);
		}
	}

	public async removeEvent(memberId: ObjectId, eventId: ObjectId): Promise<Event> {
		try {
			const result = await this.eventModel
				.findOneAndUpdate(
					{
						_id: eventId,
						businessId: memberId,
						deletedAt: null,
					},
					{
						eventStatus: EventStatus.DELETED,
						deletedAt: new Date(),
					},
					{ new: true },
				)
				.exec();

			if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

			return result;
		} catch (err) {
			console.log('Error, Service.removeEvent:', err.message);
			throw new BadRequestException(err.message);
		}
	}

	public async getBusinessEvents(memberId: ObjectId, input: BusinessEventsInquiry): Promise<Events> {
		try {
			const { page, limit, sort, direction, search } = input;

			// Prevent accessing deleted events
			if (search.eventStatus === EventStatus.DELETED) {
				throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
			}

			const match: any = {
				businessId: memberId,
				eventStatus: search.eventStatus ?? { $ne: EventStatus.DELETED },
				deletedAt: null,
			};

			// Search filters
			if (search.categoryList && search.categoryList.length > 0) {
				match.eventCategory = { $in: search.categoryList };
			}

			// Sorting
			const sortCriteria: T = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

			const result = await this.eventModel
				.aggregate([
					{ $match: match },
					{ $sort: sortCriteria },
					{
						$facet: {
							list: [
								{ $skip: (page - 1) * limit },
								{ $limit: limit },
								// Lookup business data
								lookupMember1,
								{ $unwind: '$businessData' },
							],
							metaData: [{ $count: 'total' }],
						},
					},
				])
				.exec();

			if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

			return result[0];
		} catch (err) {
			console.log('Error, Service.getBusinessEvents:', err.message);
			throw new BadRequestException(err.message);
		}
	}
}
