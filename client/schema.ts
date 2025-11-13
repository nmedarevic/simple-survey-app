
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  documents: "src/**/*.tsx",
  generates: {
    "src/gql/gqlTypes.ts": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
