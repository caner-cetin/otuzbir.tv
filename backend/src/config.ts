// https://stackoverflow.com/a/77337338/22757599 yoinked
export function ensureDefined<T>(item: T | undefined, message: string): T {
	if (item === undefined) {
		throw new Error(message);
	}
	return item;
}

export const JWT_SECRET = ensureDefined(
	process.env.JWT_SECRET,
	"JWT_SECRET not found in environment variables",
);
export const JWT_REFRESH_SECRET = ensureDefined(
	process.env.JWT_REFRESH_SECRET,
	"JWT_REFRESH_SECRET not found in environment variables",
);
export const SESSION_TOKEN_EXPIRY_TIME = process.env.SESSION_TOKEN_EXPIRY_TIME
	? Number.parseInt(process.env.SESSION_TOKEN_EXPIRY_TIME)
	: 3600;
export const REFRESH_TOKEN_EXPIRY_TIME = process.env.REFRESH_TOKEN_EXPIRY_TIME
	? Number.parseInt(process.env.REFRESH_TOKEN_EXPIRY_TIME)
	: 86400;
export const VERIFICATION_CODE_EXPIRY_TIME = process.env
	.VERIFICATION_CODE_EXPIRY_TIME
	? Number.parseInt(process.env.VERIFICATION_CODE_EXPIRY_TIME)
	: 3600;
export const JUDGE0_BASE_API_URL = ensureDefined(
	process.env.JUDGE0_BASE_API_URL,
	"JUDGE0_BASE_API_URL not found in environment variables",
);
export const JUDGE0_AUTHZ_HEADER = ensureDefined(
	process.env.JUDGE0_AUTHZ_HEADER,
	"JUDGE0_AUTHZ_HEADER not found in environment variables",
);
export const JUDGE0_AUTHZ_TOKEN = ensureDefined(
	process.env.JUDGE0_AUTHZ_TOKEN,
	"JUDGE0_AUTHZ_TOKEN not found in environment variables",
);
export const JUDGE0_AUTHN_HEADER = ensureDefined(
	process.env.JUDGE0_AUTHN_HEADER,
	"JUDGE0_AUTHN_HEADER not found in environment variables",
);
export const JUDGE0_AUTHN_TOKEN = ensureDefined(
	process.env.JUDGE0_AUTHN_TOKEN,
	"AUTHN_TOKEN not found in environment variables",
);

const response = await Bun.fetch(`${JUDGE0_BASE_API_URL}/authenticate`, {
	headers: { [JUDGE0_AUTHN_HEADER]: JUDGE0_AUTHN_TOKEN },
	method: "POST",
});
if (!response.ok) {
	console.log(
		`>> ${response.url} ${response.status} ${response.statusText} ${await response.json()} ${response.headers}`,
	);
	console.error(
		"JUDGE0 authentication failed, check JUDGE0_AUTHN_TOKEN and JUDGE0_AUTHN_HEADER",
	);
	process.exit(1);
} else {
	console.log(
		"JUDGE0 authentication successful, initialization of the judge is complete. Beep.",
	);
}

export const ECLIPSE_JDTLS_PATH = "/opt/homebrew/Cellar/jdtls/1.40.0";
export const WORKSPACE_FOLDER = ensureDefined(
	process.env.WORKSPACE_FOLDER,
	"WORKSPACE_FOLDER not found in environment variables",
);
