export type CfIceServers = {
	iceServers: [
		{ urls: string[] },
		{ urls: string[]; username: string; credential: string },
	];
};
