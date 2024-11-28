import { auth } from "@/auth.tsx";
import type { TypedDocumentString } from "@/graphql/graphql.ts";
import axios, { type AxiosError } from "axios";
import Cookies from "js-cookie";

interface GraphQLError {
	message: string;
	locations: Array<{ line: number; column: number }>;
	path: string[];
}

interface GraphQLResponse<T> {
	data?: T;
	errors?: GraphQLError[];
}

class GraphQLErrorsError extends Error {
	constructor(public errors: GraphQLError[]) {
		super(errors.map((e) => e.message).join(", "));
		this.name = "GraphQLErrorsError";
	}
}

export async function execute<TResult, TVariables>(
	query: TypedDocumentString<TResult, TVariables>,
	...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
	const sessionId = Cookies.get(auth.sessionCookieName) ?? null;

	try {
		const response = await axios<GraphQLResponse<TResult>>({
			url: "http://127.0.0.1:3000",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${sessionId}`,
				Accept: "application/graphql-response+json",
			},
			data: {
				query: query,
				variables,
			},
		});

		if (response.data.errors) {
			throw new GraphQLErrorsError(response.data.errors);
		}

		return response.data.data!;
	} catch (error) {
		if (error instanceof GraphQLErrorsError) {
			throw error;
		}
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<GraphQLResponse<TResult>>;
			if (axiosError.response?.data.errors) {
				throw new GraphQLErrorsError(axiosError.response.data.errors);
			}
		}
		throw error;
	}
}
