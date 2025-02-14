import { XRPCError } from '@atcute/client';
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	console.error(error);

	if (error instanceof XRPCError) {
		switch (error.kind) {
			case 'InternalServerError': {
				return {
					message: `Upstream server returned an internal server error`,
				};
			}
		}
	}

	if (status === 404) {
		return {
			message: `Page not found`,
		};
	}

	return {
		message: `Something went wrong, sorry about that`,
	};
};
