export const getChatRoomIDByName = (username) => {
	return new Promise((resolve, reject) => {
		fetch('https://kick.com/api/v1/channels/' + username)
			.then((response) => response.json())
			.then((json) => resolve(json.chatroom.id))
			.catch((error) => reject(error));
	});
};
