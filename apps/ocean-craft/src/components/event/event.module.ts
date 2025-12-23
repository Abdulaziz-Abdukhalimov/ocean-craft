import { Module } from '@nestjs/common';
import { EventResolver } from './event.resolver';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import EventSchema from '../../schemas/Event.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]), AuthModule, MemberModule, ViewModule],
	providers: [EventResolver, EventService],
	exports: [EventService],
})
export class EventModule {}
