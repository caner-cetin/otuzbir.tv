export class HttpException extends Error {
	public readonly statusCode: number;
	public readonly errorCode: string;
	public readonly timestamp: Date;
	public readonly details: any;
	public readonly path: string | undefined;

	constructor(
		statusCode: number,
		message: string,
		errorCode = "INTERNAL_SERVER_ERROR",
		details: any = null,
		path?: string,
	) {
		super(message);

		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it
		Error.captureStackTrace(this, this.constructor);

		this.statusCode = statusCode;
		this.errorCode = errorCode;
		this.timestamp = new Date();
		this.details = details;
		this.path = path;

		// Ensure the `message` property is enumerable
		Object.defineProperty(this, "message", { enumerable: true });
	}
	public static isHttpException(error: any): error is HttpException {
		return error instanceof HttpException;
	}
}
