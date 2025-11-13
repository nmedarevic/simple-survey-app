
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  generates: {
    "./src/graphql/gqlTypes.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    },
    "./src/graphql/graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};

export default config;
