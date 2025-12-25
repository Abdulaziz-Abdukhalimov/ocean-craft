import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
	AllEventsInquiry,
	BusinessEventsInquiry,
	EventCreate,
	Events,
	EventsInquiry,
} from '../../libs/dto/event/event.input';
import { Member } from '../../libs/dto/member/member';
import { Direction, Message } from '../../libs/enums/common.enum';
import { EventStatus } from '../../libs/enums/event.enum';
import { Event } from '../../libs/dto/event/event';
import { EventUpdate } from '../../libs/dto/event/event.update';
import { StatisticModifier, T } from '../../libs/types/common';
import { lookupMember, lookupMember1 } from '../../libs/config';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { MemberService } from '../member/member.service';
import * as moment from 'moment';

@Injectable()
export class EventService {
	constructor(
		@InjectModel('Event') private readonly eventModel: Model<Event>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private viewService: ViewService,
		private memberService: MemberService,
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
				eventStatus: EventStatus.ACTIVE,
			});
			//increase memberEvents
			await this.memberService.memberStatsEditor({ _id: newEvent.businessId, targetKey: 'memberEvents', modifier: 1 });

			return newEvent;
		} catch (err) {
			console.log('Error: service-createEvent:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
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
				updateFields.eventStatus = EventStatus.ACTIVE;
				updateFields.approvedAt = null;
			}
			if (event.eventStatus === EventStatus.CANCELLED) updateFields.cancelledAt = moment().toDate();
			if (event.eventStatus === EventStatus.COMPLETED) updateFields.completedAt = moment().toDate();

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
			throw new BadRequestException(Message.REMOVE_FAILED);
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

			if (search.categoryList && search.categoryList.length > 0) {
				match.eventCategory = { $in: search.categoryList };
			}

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
							metaCounter: [{ $count: 'total' }],
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

	//users
	public async getEvent(memberId: ObjectId, eventId: ObjectId): Promise<Event> {
		const search: any = {
			_id: eventId,
			eventStatus: EventStatus.ACTIVE,
			deletedAt: null,
		};

		const targetEvent: Event = await this.eventModel.findOne(search).lean().exec();
		if (!targetEvent) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = {
				memberId: memberId,
				viewRefId: eventId,
				viewGroup: ViewGroup.EVENT,
			};
			const newView = await this.viewService.recordView(viewInput);

			if (newView) {
				await this.eventStatsEditor({
					_id: eventId,
					targetKey: 'eventViews',
					modifier: 1,
				});
				targetEvent.eventViews++;
			}
		}

		// Populate business data
		targetEvent.businessData = await this.memberService.getMember(null, targetEvent.businessId);

		return targetEvent;
	}

	public async eventStatsEditor(input: StatisticModifier): Promise<Event> {
		const { _id, targetKey, modifier } = input;
		return await this.eventModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async getEvents(memberId: ObjectId, input: EventsInquiry): Promise<Events> {
		try {
			const { page, limit, sort, direction, search } = input;
			const match: any = {
				eventStatus: EventStatus.ACTIVE,
			};

			// Search filters
			if (search.businessId) match.businessId = search.businessId;
			if (search.categoryList && search.categoryList.length > 0) {
				match.eventCategory = { $in: search.categoryList };
			}
			if (search.availabilityList && search.availabilityList.length > 0) {
				match.eventAvailabilityStatus = { $in: search.availabilityList };
			}
			if (search.city) match['eventLocation.city'] = { $regex: search.city, $options: 'i' };
			if (search.pricesRange) {
				match.eventPrice = {
					$gte: search.pricesRange.start,
					$lte: search.pricesRange.end,
				};
			}
			if (search.text) {
				match.$text = { $search: search.text };
			}

			// Sorting
			const sortCriteria: any = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

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
								lookupMember,
								{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
							],
							metaCounter: [{ $count: 'total' }],
						},
					},
				])
				.exec();

			if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

			return result[0];
		} catch (err) {
			console.log('Error, Service.getEvents:', err.message);
			throw new BadRequestException(err.message);
		}
	}

	//ADMIN
	public async getAllEventsByAdmin(input: AllEventsInquiry): Promise<Events> {
		try {
			const { page, limit, sort, direction, search } = input;

			if (search.eventStatus === EventStatus.DELETED) {
				throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
			}

			const match: any = {
				eventStatus: search.eventStatus ?? { $ne: EventStatus.DELETED },
				deletedAt: null,
			};

			if (search.businessId) match.businessId = search.businessId;
			if (search.categoryList && search.categoryList.length > 0) {
				match.eventCategory = { $in: search.categoryList };
			}

			const sortCriteria: any = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

			const result = await this.eventModel
				.aggregate([
					{ $match: match },
					{ $sort: sortCriteria },
					{
						$facet: {
							list: [
								{ $skip: (page - 1) * limit },
								{ $limit: limit },
								lookupMember,
								{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
							],
							metaCounter: [{ $count: 'total' }],
						},
					},
				])
				.exec();

			if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

			return result[0];
		} catch (err) {
			console.log('Error, Service.getAllEvents:', err.message);
			throw new BadRequestException(err.message);
		}
	}

	public async updateEventStatusByAdmin(input: EventUpdate): Promise<Event> {
		const { _id, eventStatus } = input;

		const search: T = {
			_id,
			eventStatus: { $ne: EventStatus.DELETED },
		};

		const update: Partial<Event> = {
			eventStatus,
		};

		const now = new Date();

		switch (eventStatus) {
			case EventStatus.REJECTED:
				update.rejectedAt = now;
				break;
			case EventStatus.DELETED:
				update.deletedAt = now;
				break;
			case EventStatus.CANCELLED:
				update.cancelledAt = now;
				break;
		}

		const result = await this.eventModel.findOneAndUpdate(search, update, { new: true }).exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		if (eventStatus === EventStatus.DELETED) {
			await this.memberService.memberStatsEditor({
				_id: result.businessId,
				targetKey: 'memberEvents',
				modifier: -1,
			});
		}

		return result;
	}
}
