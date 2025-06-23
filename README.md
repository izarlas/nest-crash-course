## Nest Crash Course with Typescript

A hands-on learning repository featuring personal solutions and experiments using [NestJS](https://nestjs.com/) and TypeScript, for personal educational purposes. It demonstrates a RESTful API for managing CRUD operations, including validation, error handling, and testing.

### Features

- **MongoDB** integration via Mongoose
- **Item CRUD API** with validation using [zod](https://zod.dev/)
- **Custom Pipes** for input validation (MongoDB ID, non-empty strings, zod schemas)
- **Custom Exception Handling** for consistent error responses
- **Swagger/OpenAPI** documentation at `/api-docs`
- **Comprehensive Testing** with Jest and Supertest, using an in-memory MongoDB server

### Getting Started

- Install dependencies: `npm install`
- Create the environment file `.env` containing the environment variable `MONGO_URI` as in `.env-example` and set your MongoDB URI
- Start the server `npm run start` or in development mode `npm run dev` with hot reload
  - Access the API at [http://localhost:3000](http://localhost:3000)
  - Access the Swagger UI at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### API Endpoints

| Method | Endpoint    | Description              |
| ------ | ----------- | ------------------------ |
| GET    | /items      | Returns all items        |
| GET    | /items/{id} | Returns item by Id       |
| POST   | /items      | Create a new item        |
| PUT    | /items/{id} | Update an item by Id     |
| PATCH  | /items/{id} | Partially update an item |
| DELETE | /items/{id} | Delete an item by Id     |

For full details, see the [Swagger UI](http://localhost:3000/api-docs).

### Testing

This project uses [Jest](https://jestjs.io/) for testing and code coverage.

- To run tests:
  `npm run test`
- To run single test
  `npm run test -- -t "name"`
- To view coverage:
  `npm run test:coverage`

Test results and coverage reports will be shown in the terminal.

### License

This project is licensed under the MIT License.
