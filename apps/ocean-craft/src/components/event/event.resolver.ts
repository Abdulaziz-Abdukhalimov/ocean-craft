import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Roles } from '../auth/decoraters/roles.decorater';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { BusinessEventsInquiry, EventCreate, Events, EventsInquiry } from '../../libs/dto/event/event.input';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { ObjectId } from 'mongoose';
import { Event } from '../../libs/dto/event/event';
import { EventUpdate } from '../../libs/dto/event/event.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class EventResolver {
	constructor(private readonly eventService: EventService) {}

	//Seller mutations
	@Roles(MemberType.AGENT)
	@UseGuards(AuthGuard, RolesGuard)
	@Mutation(() => Event)
	public async createEvent(@Args('input') input: EventCreate, @AuthMember('_id') memberId: ObjectId): Promise<Event> {
		console.log('mutation: createEvent');
		return await this.eventService.createEvent(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(AuthGuard, RolesGuard)
	@Mutation(() => Event)
	public async updateEvent(@Args('input') input: EventUpdate, @AuthMember('_id') memberId: ObjectId): Promise<Event> {
		console.log('mutation: updateEvent');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.eventService.updateEvent(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(AuthGuard, RolesGuard)
	@Mutation(() => Event)
	public async removeEvent(@Args('eventId') eventId: string, @AuthMember('_id') memberId: ObjectId): Promise<Event> {
		console.log('Resolver: removeEvent');
		const eventIdObj = shapeIntoMongoObjectId(eventId);
		return await this.eventService.removeEvent(memberId, eventIdObj);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(AuthGuard, RolesGuard)
	@Query(() => Events)
	public async getBusinessEvents(
		@Args('input') input: BusinessEventsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Events> {
		console.log('Resolver: getBusinessEvents');
		return await this.eventService.getBusinessEvents(memberId, input);
	}

	//User
	@UseGuards(WithoutGuard)
	@Query(() => Event)
	public async getEvent(@Args('eventId') eventId: string, @AuthMember('_id') memberId: ObjectId): Promise<Event> {
		console.log('Resolver: getEvent');
		const eventIdObj = shapeIntoMongoObjectId(eventId);
		return await this.eventService.getEvent(memberId, eventIdObj);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Events)
	public async getEvents(@Args('input') input: EventsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Events> {
		console.log('Resolver: getEvents');
		return await this.eventService.getEvents(memberId, input);
	}
}
