import type { FastifyPluginAsync } from "fastify";
import { HttpException } from "../models/Exception";

export const errorHandler: FastifyPluginAsync = async (fastify) => {
	fastify.setErrorHandler((error, request, reply) => {
		fastify.log.error(error);

		if (HttpException.isHttpException(error)) {
			console.error(
				`${error.timestamp} >> ${error.statusCode} ${error.code} ${error.path} ${error.details} ${error.stack} ${error.cause}`,
			);
			return reply.status(error.statusCode).send(error);
		}
		return reply
			.status(error.statusCode ?? 500)
			.send("Something went horribly wrong");
	});
};
