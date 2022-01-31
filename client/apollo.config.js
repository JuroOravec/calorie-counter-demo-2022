module.exports = {
  client: {
    service: {
      name: 'my-graphql-app',
      localSchemaFile: 'src/__generated__/graphql.schema.json',
    },
    includes: ['./src/**/*.ts', './src/**/*.graphql'],
    excludes: ['**/__tests__/**', '**/__generated__/**'],
  },
};
