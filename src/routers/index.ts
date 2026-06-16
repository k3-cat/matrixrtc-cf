import { Hono } from "hono";

import { HttpResponseHeader, HttpStatus } from "http-enums";

import { LogicalError } from "$/errors";
import type { HonoCtx } from "$/schemas/hono-ctx";

import voipRoute from "./voip";

const app = new Hono<HonoCtx>();

app.route("/_matrix/client/r0/voip", voipRoute);
app.route("/_matrix/client/v3/voip", voipRoute);

app.get("*", async (c) => {
	c.header(
		HttpResponseHeader.CACHE_CONTROL,
		"public, max-age=864000, immutable",
	);
	throw new LogicalError(HttpStatus.NOT_FOUND, {
		mrc: "r:*",
		path: c.req.path,
	});
});

export default app;
