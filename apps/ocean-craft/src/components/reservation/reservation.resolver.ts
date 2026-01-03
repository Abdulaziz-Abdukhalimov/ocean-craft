import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { ObjectId } from 'mongoose';
import { AgentReservationsResponse, Reservation, ReservationStatistics } from '../../libs/dto/reservation/reservation';
import {
	AgentReservationInquiry,
	CreateReservationInput,
	UpdateReservationStatusInput,
} from '../../libs/dto/reservation/reservation.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AvailableDate } from '../../libs/dto/event/event.input';
import { Roles } from '../auth/decoraters/roles.decorater';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EventStatus } from '../../libs/enums/event.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class ReservationResolver {
	constructor(private readonly reservationService: ReservationService) {}

	//** USER ** //
	@UseGuards(AuthGuard)
	@Mutation(() => Reservation)
	public async bookEvent(
		@Args('input') input: CreateReservationInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Reservation> {
		console.log('Mutation: BookEvent');
		console.log('Booking for member:', memberId);
		return this.reservationService.bookEvent(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => [AvailableDate])
	public async getAvailableDates(@Args('eventId') eventId: string): Promise<AvailableDate[]> {
		console.log('Query: getAvailableDates');
		return this.reservationService.getAvailableDates(eventId);
	}

	@UseGuards(AuthGuard)
	@Query(() => [Reservation])
	public async getMyReservations(@AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getMyReservations');
		return this.reservationService.getMyReservations(memberId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Reservation)
	public async getReservation(@Args('reservationId') reservationId: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getMyReservation');
		return this.reservationService.getReservation(reservationId, memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Reservation)
	public async cancelReservation(@Args('reservationId') reservationId: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: cancelReservation');
		return this.reservationService.cancelReservation(reservationId, memberId);
	}

	//** AGENT **//
	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Query(() => AgentReservationsResponse)
	public async getAgentReservations(
		@AuthMember('_id') agentId: ObjectId,
		@Args('input', { nullable: true }) input?: AgentReservationInquiry,
	) {
		console.log('Query: getAgentReservations');
		return this.reservationService.getAgentReservations(agentId, input);
	}

	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Query(() => Reservation)
	public async getAgentReservation(@Args('reservationId') reservationId: string, @AuthMember('_id') agentId: ObjectId) {
		console.log('Query: getAgentReservation');
		return this.reservationService.getAgentReservation(reservationId, agentId);
	}

	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Query(() => ReservationStatistics)
	public async getReservationStatistics(@AuthMember('_id') agentId: ObjectId) {
		console.log('Query: getReservationStatistics');
		return this.reservationService.getReservationStatistics(agentId);
	}

	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Mutation(() => Reservation)
	public async updateReservationStatus(
		@Args('input') input: UpdateReservationStatusInput,
		@AuthMember('_id') agentId: ObjectId,
	) {
		console.log('Mutation: updateReservationStatus');
		return this.reservationService.updateReservationStatus(agentId, input);
	}
}
