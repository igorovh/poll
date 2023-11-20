import Settings from '../settings.js';
import { Client } from './kick-chat.js';
import { getChatRoomIDByName } from './kick-api.js';
import { handleMessage } from '../chat-handler.js';

export const kickInit = async () => {
	const roomId = await getChatRoomIDByName(Settings.channel);

	const client = new Client({ channels: [roomId] });

	client.on('subbed', () => console.info('[Kick] Joined channel -', roomId));

	client.on('message', (message) => {
		if (message.type !== 'message') return;
		const formattedMessage = {
			username: message.sender.username,
			userId: message.sender.id,
			content: message.content,
			moderator: findBadge('moderator', message.sender.identity.badges),
			broadcaster: findBadge('broadcaster', message.sender.identity.badges),
		};
		handleMessage(formattedMessage);
	});

	client.connect();
};

export const findBadge = (type, array) => {
	let found = false;
	array.forEach((badge) => {
		if (badge.type === type) found = true;
	});
	return found;
};
