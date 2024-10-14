import type { Dayjs } from "dayjs";
import type { Generated } from "kysely";

export interface SubmissionsTable {
	id: Generated<number>;
	judgeToken: string;
	sourceCode: string;
	stdin: string | undefined;
	sent: boolean;
	createdAt: Dayjs | undefined;
	updatedAt: Dayjs | undefined;
	deletedAt: Dayjs | undefined;
}
