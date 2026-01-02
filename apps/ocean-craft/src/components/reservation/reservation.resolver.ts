import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { ObjectId } from 'mongoose';
import { AgentReservationsResponse, Reservation, ReservationStatistics } from '../../libs/dto/reservation/reservation';
import { AgentReservationInquiry, CreateReservationInput } from '../../libs/dto/reservation/reservation.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AvailableDate } from '../../libs/dto/event/event.input';
import { Roles } from '../auth/decoraters/roles.decorater';
import { RolesGuard } from '../auth/guards/roles.guard';
import { EventStatus } from '../../libs/enums/event.enum';

@Resolver()
export class ReservationResolver {
	constructor(private readonly reservationService: ReservationService) {}

	//USER
	@UseGuards(AuthGuard)
	@Mutation(() => Reservation)
	public async bookEvent(
		@Args('input') input: CreateReservationInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Reservation> {
		console.log('Booking for member:', memberId);
		return this.reservationService.bookEvent(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => [AvailableDate])
	public async getAvailableDates(@Args('eventId') eventId: string): Promise<AvailableDate[]> {
		return this.reservationService.getAvailableDates(eventId);
	}

	@UseGuards(AuthGuard)
	@Query(() => [Reservation])
	async getMyReservations(@AuthMember('_id') memberId: ObjectId) {
		return this.reservationService.getMyReservations(memberId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Reservation)
	async getReservation(@Args('reservationId') reservationId: string, @AuthMember('_id') memberId: ObjectId) {
		return this.reservationService.getReservation(reservationId, memberId);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Reservation)
	async cancelReservation(@Args('reservationId') reservationId: string, @AuthMember('_id') memberId: ObjectId) {
		return this.reservationService.cancelReservation(reservationId, memberId);
	}

	//AGENT
	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Query(() => AgentReservationsResponse)
	async getAgentReservations(
		@AuthMember('_id') agentId: ObjectId,
		@Args('input', { nullable: true }) input?: AgentReservationInquiry,
	) {
		return this.reservationService.getAgentReservations(agentId, input);
	}

	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Query(() => Reservation)
	async getAgentReservation(@Args('reservationId') reservationId: string, @AuthMember('_id') agentId: ObjectId) {
		return this.reservationService.getAgentReservation(reservationId, agentId);
	}

	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Query(() => ReservationStatistics)
	async getReservationStatistics(@AuthMember('_id') agentId: ObjectId) {
		return this.reservationService.getReservationStatistics(agentId);
	}

	@UseGuards(RolesGuard)
	@Roles('AGENT')
	@Mutation(() => Reservation)
	async updateReservationStatus(
		@Args('reservationId') reservationId: string,
		@Args('status', { type: () => EventStatus }) status: EventStatus,
		@AuthMember('_id') agentId: ObjectId,
	) {
		return this.reservationService.updateReservationStatus(reservationId, status, agentId);
	}
}
