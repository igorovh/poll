import { createQuestion, vote, skipVote } from './poll.js';
import Settings from './settings.js';

let messageCache = {};

const commands = [
	{
		names: ['quickvote', 'qvote', 'quickpoll', 'qpoll'],
		moderator: true,
		executor: (data, args) => {
			let options = 2;
			if (args.length > 0) {
				try {
					let answers = parseInt(args[0]);
					if (!isNaN(answers) && answers !== null && answers !== undefined) {
						options = answers;
						if (options > 12) options = 12;
					}
				} catch (error) {}
			}
			const answers = [...Array(options).keys()];
			createQuestion(
				{
					question: `Choose number from 1 to ${options}`,
					answers,
					seconds: 30,
				},
				true
			);
		},
	},
	{
		names: ['skipvote', 'svote', 'skippoll', 'spoll'],
		moderator: true,
		executor: () => skipVote(),
	},
	{
		names: ['customvote', 'cvote', 'custompoll', 'cpoll'],
		moderator: true,
		executor: (data, args) => {
			let seconds = 30;
			if (args.length > 0) {
				try {
					let time = parseInt(args[0]);
					if (!isNaN(time) && time !== null && time !== undefined) seconds = time;
				} catch (error) {}
			}
			if (seconds < 10) return;

			let cache = messageCache[data.userId];
			if (!cache) {
				messageCache[data.userId] = {
					timestamp: Date.now(),
					answers: [],
					seconds,
				};
			} else {
				if (cache.question !== undefined && cache.seconds >= 10 && cache.answers.length >= 2) {
					createQuestion(cache);
				}
				delete messageCache[data.userId];
			}
		},
	},
	{
		names: ['canclecustomvote', 'ccvote', 'cancelcustompoll', 'ccpoll'],
		moderator: true,
		executor: (data) => delete messageCache[data.userId],
	},
];

export const handleMessage = (message) => {
	if (!message.content.startsWith('!')) {
		handleCache(message.content, message.userId);
		handleVote(message.content, message.userId);
		return;
	}

	const args = message.content.slice(1).split(' ');
	const commandName = args.shift().toLowerCase();

	const data = {
		username: message.username,
		userId: message.userId,
		moderator: message.moderator || message.broadcaster,
	};

	const command = commands.find((command) => command.names.includes(commandName));
	if (!command) return;

	if (command.moderator && !data.moderator && !Settings.allowList.includes(data.username)) return;

	command.executor(data, args);
};

export const handleCache = (content, userId) => {
	let cache = messageCache[userId];
	if (!cache) return;
	// If user spent 5 minutes and didn't start poll it removes from cache
	// OR
	// If answers size is bigger than 12 it removes from cache
	if (cache.answers.length > 12 || Date.now() >= cache.timestamp + 300000) {
		delete messageCache[userId];
		return;
	}
	if (cache.question === undefined) {
		cache.question = content;
	} else cache.answers.push(content);

	messageCache[userId] = cache;
};

export const handleVote = (content, userId) => {
	const args = content.split(' ');
	if (args.length < 1) return;
	try {
		const voteId = parseInt(args[0]);
		if (isNaN(voteId) || voteId === null || voteId === undefined) return;
		vote(voteId, userId);
	} catch (error) {}
};
