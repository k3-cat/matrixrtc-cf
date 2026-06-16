const uniqueSymbol = Symbol("uniqueSymbol");

export type HonoVars = { [uniqueSymbol]?: never };

export type HonoCtx = {
	Bindings: Cloudflare.Env;
	Variables: HonoVars;
};
