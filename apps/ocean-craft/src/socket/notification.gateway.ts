import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:4001',
		credentials: true,
	},
	namespace: 'notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server; // <- Socket.IO server instance

	private readonly logger = new Logger(NotificationGateway.name);

	handleConnection(client: Socket) {
		this.logger.log(`Client connected: ${client.id}`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('joinNotificationRoom')
	handleJoinRoom(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
		const room = `user_${data.userId}`;
		client.join(room); // Add this user to their personal room

		this.logger.log(`User ${data.userId} joined notification room: ${room}`);

		client.emit('joinedRoom', { room, message: 'Successfully joined notification room' });
	}

	sendNotificationToUser(userId: string, notification: any) {
		const room = `user_${userId}`;

		this.server.to(room).emit('newNotification', notification);

		this.logger.log(`Notification sent to user ${userId} in room ${room}`);
	}

	broadcastToAll(message: string) {
		this.server.emit('systemMessage', { message });
	}
}
