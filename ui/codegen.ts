import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: "../crates/server/schema.graphqls",
    documents: ['src/**/*.{ts,tsx}'],
    ignoreNoDocuments: true,
    generates: {
        './src/__generated__/': {
            preset: 'client'
        }
    }
}

export default config