## Description

## Installation

```bash
$ yarn install
```

## Running the app

```bash
$ Add the below environment variables in .env file:
MONGODB_URI="mongodb://localhost:27017" # MongoDB URI
NODE_ENV=development # Node environment
PORT=3009 # Port number
HOST=127.0.0.1 # Host
LOG_LEVEL=error/info/debug # Log level
JWT_SECRET='easy-generator-secret' # JWT secret
```

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

There are no e2e tests for this project.    

# test coverage
$ yarn run test:cov
```

