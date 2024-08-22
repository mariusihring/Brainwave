import axios from "axios";
import Cookies from "js-cookie";
import {auth} from "@/auth.tsx";
import {TypedDocumentString} from "@/graphql/graphql.ts";


export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const sessionId = Cookies.get(auth.sessionCookieName) ?? null
  //TODO: make some type magic
// : {
//     data: TResult,
//       errors: { message: string, locations: { line: number, column: number }[], path: string[] }[]
//   }
  const response = await axios({
    url: 'http://127.0.0.1:3000',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
      Accept: 'application/graphql-response+json'
    },
    data: {
      query: query,
      variables
    }
  });
  console.log(response)
  if (response.status !== 200) {
    throw new Error(response.data.errors);
  }
  // graphql has a data in the data
  return response.data.data as TResult;
}