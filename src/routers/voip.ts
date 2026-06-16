import { Hono } from "hono";

import type { HonoCtx } from "$/schemas/hono-ctx";
import type { MatrixTurnServerInfo } from "$/schemas/matrix-turn-server";
import { generateCred } from "$/services/cf-turn";

const app = new Hono<HonoCtx>();

app.get("turnServer", async (c) => {
	const resp = await fetch(c.req.url, c.req.raw);
	if (!resp.ok) {
		return resp;
	}

	const turnInfo = await resp.json<MatrixTurnServerInfo>();
	const cfTurnInfo = await generateCred(turnInfo.ttl);
	turnInfo.uris = cfTurnInfo.urls;
	turnInfo.username = cfTurnInfo.username;
	turnInfo.password = cfTurnInfo.credential;

	return c.json(turnInfo, resp);
});

export default app;
