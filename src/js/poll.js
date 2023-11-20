let pollEnabled = false;
let maxAnswerId = 0;

let totalVotes = 0;
let seconds = 0;
let usersVoted = [];

const elements = {};
let answers = {};

setInterval(() => {
	if (!pollEnabled) return;
	for (let i = 1; i < maxAnswerId; i++) {
		const answer = answers[i];
		let percentage = answer.votes / totalVotes;
		if (totalVotes < 1) percentage = 0;
		answer.fill.style.width = `${percentage * 320}px`;
		answer.stats.textContent = `— ${(percentage * 100).toFixed(0)}% (${answer.votes} votes)`;
	}
}, 250);

const voteAnswer = (id) => {
	totalVotes++;
	elements.pollStats.textContent = totalVotes;
	const answer = answers[id];
	answer.votes++;
};

let voteInterval;
export const createQuestion = (data, ignoreNames = false) => {
	if (pollEnabled) return;
	usersVoted = [];

	document.querySelector('.poll__question--header').textContent = data.question;

	const optionsList = document.querySelector('.options');
	optionsList.innerHTML = '';
	answers = {};
	totalVotes = 0;
	seconds = data.seconds;

	let index = 1;
	data.answers.forEach((answer) => {
		const option = document.createElement('div');
		option.classList.add('option');
		option.id = `${index}-answer`;
		const header = document.createElement('div');
		header.classList.add('option__header');
		const name = document.createElement('div');
		name.classList.add('option__name');
		name.textContent = `${index}. ${answer}`;
		if (ignoreNames) name.textContent = index;
		const stats = document.createElement('div');
		stats.classList.add('option__stats');
		stats.textContent = '— 0%';

		header.appendChild(name);
		header.appendChild(stats);
		option.appendChild(header);

		const poll = document.createElement('div');
		poll.classList.add('option__poll');
		const fill = document.createElement('div');
		fill.classList.add('option__fill');
		poll.appendChild(fill);
		option.appendChild(poll);

		answers[index] = {
			fill,
			stats,
			votes: 0,
		};

		optionsList.appendChild(option);
		elements.pollStats.textContent = 0;
		elements.pollTime.textContent = `The poll will end in ${data.seconds}s`;
		index++;
	});
	maxAnswerId = index;

	elements.main.style.opacity = 1;
	pollEnabled = true;

	if (voteInterval) clearInterval(voteInterval);
	voteInterval = setInterval(() => {
		seconds--;
		if (seconds < 0) {
			elements.pollTime.textContent = `The poll has ended.`;
		} else elements.pollTime.textContent = `The poll will end in ${seconds}s`;

		if (seconds <= -20) {
			clearInterval(voteInterval);
			pollEnabled = false;
			elements.main.style.opacity = 0;
		}
	}, 1000);
};

export const skipVote = () => {
	clearInterval(voteInterval);
	elements.main.style.opacity = 0;
	pollEnabled = false;
};

export const vote = (answerId, userId) => {
	if (!pollEnabled) return console.warn('Poll is disabled.');
	if (usersVoted.includes(userId)) return console.warn('This user already voted.');
	if (answers[answerId] === undefined) return console.warn('There is no answer with this id.');
	if (seconds < 0) return console.warn('Poll has already ended.');
	usersVoted.push(userId);
	voteAnswer(answerId);
};

window.addEventListener('DOMContentLoaded', () => {
	elements.main = document.querySelector('main');
	elements.pollStats = document.querySelector('.poll__stats--votes');
	elements.pollTime = document.querySelector('.poll__stats--time');
});
