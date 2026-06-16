import { env } from "cloudflare:workers";

import { HttpRequestHeader, HttpStatus } from "http-enums";

import { LogicalError } from "$/errors";
import type { CfIceServers } from "$/schemas/cf-turn-ice-servers";

const CF_TURN_CREDENTIAL_URL = `https://rtc.live.cloudflare.com/v1/turn/keys/${env.CF_TURN_TOKEN_ID}/credentials/generate-ice-servers`;

export async function generateCred(ttl: number) {
	const resp = await fetch(CF_TURN_CREDENTIAL_URL, {
		method: "POST",
		headers: {
			[HttpRequestHeader.CONTENT_TYPE]: "application/json",
			[HttpRequestHeader.AUTHORIZATION]: `Bearer ${env.CF_TURN_API_TOKEN}`,
		},
		body: JSON.stringify({ ttl }),
	});
	if (resp.status !== 201) {
		throw new LogicalError(HttpStatus.INTERNAL_SERVER_ERROR, {
			mrc: "ct:gc",
			msg: `cf replies ${resp.status} instead of 201`,
		});
	}

	for (const record of (await resp.json<CfIceServers>()).iceServers) {
		if ("username" in record) {
			return record;
		}
	}
	throw new LogicalError(HttpStatus.INTERNAL_SERVER_ERROR, {
		mrc: "ct:gc",
		msg: `cannot retrive a valid record from response`,
	});
}
