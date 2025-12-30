import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReservationService } from './reservation.service';
import { AuthMember } from '../auth/decoraters/authMember.decorater';
import { ObjectId } from 'mongoose';
import { Reservation } from '../../libs/dto/reservation/reservation';
import { CreateReservationInput } from '../../libs/dto/reservation/reservation.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AvailableDate } from '../../libs/dto/event/event.input';

@Resolver()
export class ReservationResolver {
	constructor(private readonly reservationService: ReservationService) {}

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
}
