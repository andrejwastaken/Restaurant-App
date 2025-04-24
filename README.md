# RestaurantApp

This is a full-stack web application that allows users to reserve tables at our restaurants. It is a project built for the course - Internet Programming on the Client Side. It is built with:

- **Backend:** Django
- **Frontend:** React with JavaScript and Vite
- **Database:** PostgreSQL
- **Containerized:** Using Docker and Docker Compose

## Quick Setup

### 1. Clone this repository: `git clone https://github.com/andrejwastaken/Restaurant-App.git`

### 2. Set up environment variables

You need two .env files for the project to run:

In the backend/ directory:

```bash
DB_NAME=x
DB_USER=x
DB_PASS=x
DB_HOST=x
DB_PORT=5432
```

In the root directory:

```bash
POSTGRES_PASSWORD=x
DB_USER=x
DB_NAME=x
DB_HOST=x
```

> Adjust the values according to your environment

### 3. Build and run the project using Docker Compose: `docker-compose up --build`

> Make sure you have Docker and Docker Compose installed on your system.

### 4. Populate the database

Once everything is set up, you can populate the database with existing data.

