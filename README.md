# About.

This is an implementation of common http client that implements some http request abstraction.

# Why do we have that dependencies?

* `@eigenspace/url-replacer` - to process template urls.
* `@eigenspace/logger` - to log events.

# Why do we have that dev dependencies?

* `@eigenspace/common-types` - common types such as dictionary, etc.
* `@eigenspace/codestyle` - includes lint rules, config for typescript.
* `@eigenspace/commit-linter` - linter for commit messages.
* `@eigenspace/helper-scripts` - is used for publish package.
* `@types/*` - contains type definitions for specific library.
* `clean-webpack-plugin` - it's used for clean bundle before run building.
* `ts-loader` - it's used to load typescript code with webpack.
* `jest` - testing framework to write unit specs (including snapshots).
* `typescript` - is a superset of JavaScript that have static type-checking and ECMAScript features.
* `ts-jest` - it lets you use Jest to test projects written in TypeScript.
* `husky` - used for configure git hooks.
* `eslint` - it checks code for readability, maintainability, and functionality errors.
* `eslint-plugin-eigenspace-script` - includes set of script linting rules and configuration for them.
* `lint-staged` - used for configure linters against staged git files.
* `webpack` - it creates app bundle for dev. mode and production.
* `copy-webpack-plugin` - used for copying mocks to dev server.
* `webpack-cli` - cli for webpack, provides commands for tasks.