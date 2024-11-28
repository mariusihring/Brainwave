// import type { CodegenConfig } from '@graphql-codegen/cli';
//
// const config: CodegenConfig = {
//     schema: "../crates/server/schema.graphqls",
//     documents: ['src/**/*.{ts,tsx}'],
//     ignoreNoDocuments: true,
//     generates: {
//         './src/__generated__/': {
//             preset: 'client'
//         }
//     }
// }
//
// export default config

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "../schema.graphqls",
	documents: ["src/**/*.{ts,tsx}"],
	ignoreNoDocuments: true,
	generates: {
		"./src/graphql/": {
			preset: "client",
			config: {
				documentMode: "string",
			},
		},
		"./schema.graphql": {
			plugins: ["schema-ast"],
			config: {
				includeDirectives: true,
			},
		},
	},
};

export default config;
