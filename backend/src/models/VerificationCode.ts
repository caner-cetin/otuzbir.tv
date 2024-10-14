import { DB } from "../db";
import dayjs from "dayjs";
import { VERIFICATION_CODE_EXPIRY_TIME } from "../config";

interface VerificationCode {
	id: number;
	code: string;
	userID: string;
	expiresAt: string;
	used: boolean;
}
