import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Event } from '../../libs/dto/event/event';
import { Reservation } from '../../libs/dto/reservation/reservation';
import { CreateReservationInput } from '../../libs/dto/reservation/reservation.input';
import { EventStatus, PaymentMethod, PaymentStatus } from '../../libs/enums/event.enum';

@Injectable()
export class ReservationService {
	constructor(
		@InjectModel('Reservation') private reservationModel: Model<Reservation>,
		@InjectModel('EventSlot') private slotModel: Model<any>,
		@InjectModel('Event') private eventModel: Model<Event>,
	) {}

	public async bookEvent(memberId: ObjectId, input: CreateReservationInput): Promise<Reservation> {
		const { eventId, date, numberOfPeople, paymentMethod, fullName, email, phone, paymentInfo } = input;

		const event = await this.eventModel.findById(eventId);
		if (!event) {
			throw new Error('Event not found');
		}
		if (event.eventStatus !== EventStatus.ACTIVE) {
			throw new Error('Event is not active');
		}

		const selectedDate = new Date(date);
		selectedDate.setHours(0, 0, 0, 0);

		const startDate = new Date(event.eventPeriod.startDate);
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date(event.eventPeriod.endDate);
		endDate.setHours(0, 0, 0, 0);

		if (selectedDate < startDate || selectedDate > endDate) {
			throw new Error(`Please select a date between ${startDate.toDateString()} and ${endDate.toDateString()}`);
		}

		if (event.eventRegistrationDeadline) {
			const deadline = new Date(event.eventRegistrationDeadline);
			if (new Date() > deadline) {
				throw new Error('Registration deadline has passed');
			}
		}

		let slot = await this.slotModel.findOne({
			eventId: eventId,
			date: selectedDate,
		});

		if (!slot) {
			slot = await this.slotModel.create({
				eventId: eventId,
				date: selectedDate,
				totalCapacity: event.eventCapacity,
				bookedCapacity: 0,
				remainingCapacity: event.eventCapacity,
			});
		}

		const updatedSlot = await this.slotModel.findOneAndUpdate(
			{
				_id: slot._id,
				remainingCapacity: { $gte: numberOfPeople },
			},
			{
				$inc: {
					bookedCapacity: numberOfPeople,
					remainingCapacity: -numberOfPeople,
				},
			},
			{ new: true },
		);

		if (!updatedSlot) {
			throw new Error(`Only ${slot.remainingCapacity} spots remaining for this date`);
		}

		const pricePerPerson = event.eventPrice;
		const totalAmount = pricePerPerson * numberOfPeople;

		let paymentStatus: PaymentStatus;
		let paymentProcessedAt: Date | undefined;
		let savedPaymentInfo: any = undefined;

		if (paymentMethod === PaymentMethod.CARD) {
			if (!paymentInfo) {
				await this.slotModel.findByIdAndUpdate(slot._id, {
					$inc: {
						bookedCapacity: -numberOfPeople,
						remainingCapacity: -numberOfPeople,
					},
				});
				throw new Error('Payment information is required for card payments');
			}

			paymentStatus = PaymentStatus.PAID;
			paymentProcessedAt = new Date();

			savedPaymentInfo = {
				cardholderName: paymentInfo.cardholderName,
				cardLastFour: paymentInfo.cardNumber.slice(-4),
			};
		} else {
			paymentStatus = PaymentStatus.PENDING;
		}

		const bookingReference = await this.generateBookingReference();

		try {
			const reservation = await this.reservationModel.create({
				eventId,
				slotId: slot._id,
				memberId,
				reservationDate: selectedDate,
				numberOfPeople,
				contactPerson: {
					fullName,
					email,
					phone,
				},
				pricePerPerson,
				totalAmount,
				paymentMethod,
				paymentInfo: savedPaymentInfo,
				paymentStatus,
				paymentProcessedAt,
				status: EventStatus.CONFIRMED,
				bookingReference,
			});

			return reservation;
		} catch (error) {
			await this.slotModel.findByIdAndUpdate(slot._id, {
				$inc: {
					bookedCapacity: -numberOfPeople,
					remainingCapacity: numberOfPeople,
				},
			});
			throw error;
		}
	}

	private async generateBookingReference(): Promise<string> {
		const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		const random = Math.random().toString(36).substring(2, 6).toUpperCase();
		return `OCN-${date}-${random}`;
	}

	//Helper: Get available dates for an event
	public async getAvailableDates(eventId: string): Promise<any[]> {
		const event = await this.eventModel.findById(eventId);
		if (!event) throw new Error('Event not found');

		const startDate = new Date(event.eventPeriod.startDate);
		const endDate = new Date(event.eventPeriod.endDate);

		// Get all slots with remaining capacity
		const slots = await this.slotModel.find({
			eventId,
			remainingCapacity: { $gt: 0 },
		});

		const bookedDates = new Map(slots.map((slot) => [slot.date.toISOString().split('T')[0], slot.remainingCapacity]));

		// Generate all dates in range
		const availableDates = [];
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const dateStr = currentDate.toISOString().split('T')[0];
			const remainingCapacity = bookedDates.get(dateStr) ?? event.eventCapacity;

			availableDates.push({
				date: dateStr,
				remainingCapacity,
				isAvailable: remainingCapacity > 0,
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return availableDates;
	}

	public async getMyReservations(memberId: ObjectId): Promise<Reservation[]> {
		const reservations = await this.reservationModel
			.find({
				memberId: memberId,
				status: { $ne: EventStatus.DELETED },
			})
			.sort({ createdAt: -1 })
			.lean();

		return reservations;
	}

	public async getReservation(reservationId: string, memberId: ObjectId): Promise<Reservation> {
		const reservation = await this.reservationModel.findOne({
			_id: reservationId,
			memberId: memberId,
		});

		if (!reservation) {
			throw new Error('Reservation not found or access denied');
		}

		return reservation;
	}
}
