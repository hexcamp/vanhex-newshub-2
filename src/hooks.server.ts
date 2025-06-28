import { ClientResponseError } from '@atcute/client';
import type { HandleServerError } from '@sveltejs/kit';

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	console.error(error);

	if (error instanceof ClientResponseError) {
		if (error.status === 403) {
			return {
				message: `Upstream server is forbidding access to this resource`,
			};
		}

		if (error.error === 'AuthRequired' || error.error === 'auth required') {
			return {
				message: `Upstream server is requiring authentication to access this resource`,
			};
		}

		if (error.error === 'InternalServerError' || error.description === 'Internal Server Error') {
			return {
				message: `Upstream server returned an internal error`,
			};
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
