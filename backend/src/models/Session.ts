import type { Dayjs } from "dayjs";
import type { Generated } from "kysely";
export interface SessionTable {
	sessionID: Generated<number>;
	userId: number;
	accessToken: string;
	refreshToken: string;
	createdAt: Dayjs;
	accessExpiresAt: Dayjs;
	refreshExpiresAt: Dayjs;
	refreshExpired: boolean;
	refreshExpiredAt: Dayjs | undefined;
}
