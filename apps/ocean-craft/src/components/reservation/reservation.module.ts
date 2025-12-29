import { Module } from '@nestjs/common';
import { ReservationResolver } from './reservation.resolver';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationSchema } from '../../schemas/EventReservation.model';
import EventSlotSchema from '../../schemas/EventSlot.model';
import EventSchema from '../../schemas/Event.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Reservation', schema: ReservationSchema },
			{ name: 'EventSlot', schema: EventSlotSchema },
			{ name: 'Event', schema: EventSchema },
		]),
		AuthModule,
	],
	providers: [ReservationResolver, ReservationService],
})
export class ReservationModule {}
