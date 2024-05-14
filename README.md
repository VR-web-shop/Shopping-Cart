# Shopping Cart
Shopping Cart Microservice

## Install

1. Setup Environment Variables
```
$ cp .env.example .env
```

2. Setup NPM Registry
Replace `YOUR_PERSONAL_TOKEN` with a classic personal token with `package:read` access.
```
$ cp .npmrc.example .npmrc
```

3. Install Dependencies
```
$ npm install
```

4. Migrate Database
```
$ npm run migrate
```

5. Seed Database
```
$ npm run seed
```

## Usage
```
npm start
```

## API Documentation
1. Start Server
2. Visit [localhost:3000/api/v1/documentation](http://localhost:3000/api/v1/documentation) for Swagger UI

