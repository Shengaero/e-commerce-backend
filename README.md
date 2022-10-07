# e-commerce-backend
A backend server application for an e-commerce website

## Table of Contents
* [Installation](#installation)
    * [Environment](#environment)
    * [Seed Data](#seed-data)
* [Usage](#usage)
    * [Starting the Server](#starting-the-server)
    * [Routes](#routes)
* [Questions](#questions)

## Installation
This program will require you have `node.js` and `mysql` installed.

Once you have both `node.js` and `mysql` installed, you can clone this repository by using the following via command line:
```bash
git clone git@github.com:Shengaero/employee-tracker.git
```

Once cloned, navigate to the installation directory and install the dependencies via npm:
```bash
npm i
```

### Environment

Finally, you will need to create a `.env` file in the root of the installation with the following environment variables:
```properties
# name of the database to create
DB_NAME='ecommerce_db'
# username to access the database with
DB_USER=''
# password to access the database with
DB_PASSWORD='root'
```

> ### Seed Data
> Before using the application, you may wish to create some seed data for testing purposes.
>
> In order to do this run the following command:
> ```bash
> npm run seed
> ```

## Usage

Everything installed? Great, now we can finally start the application!

### Starting the Server
To run this application, simply navigate to the installation directory and run the following via command line:
```bash
npm start
# or
node server.js
```

There will be a brief console output ending with the following message telling you that the server is now running:
```
App listening on port 3001!
```

### Routes

Once you've opened the server, you can freely make requests using your preferred client to the various URL routes available below:

#### `/api/tags`
- `GET /api/tags`
- `GET /api/tags/{id}`
- `POST /api/tags`
- `PUT /api/tags/{id}`
- `DELETE /api/tags/{id}`

#### `/api/products`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`

#### `/api/categories`
- `GET /api/categories`
- `GET /api/categories/{id}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

[Here's a video showing how it works](https://www.youtube.com/watch?v=MwTyhCEVSpE)

## Questions
For questions or other inquiries, feel free to reach out to me via either [GitHub](https://github.com/Shengaero) or send an email to kaidangustave@yahoo.com
