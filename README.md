# Movement Admin

## Project Checklist

-   [x] Theme
-   [x] Deployment (Sevalla)
-   [x] DB connect
-   [] DB migrate
-   [x] Dockerize
-   [x] Auth
-   [] Registration
-   [] my-clients
    -   [] client add
    -   [] client management
-   [] all-clients
    -   [] Resue from above
-   [] Coaches
    -   [] coach add
    -   [] coach management
-   [] Exercise Library
    -   [] exercise add
    -   [] exercise bulk status
    -   [] exercise edit
-   [] Indepth page for all
    -   [] Client Profile
    -   [] Coach Profile
    -   [] Exercise Profile
-   [] Settings

## Docker Setup

This project has been dockerized for easy deployment and development. Below are instructions for running the application using Docker.

### Prerequisites

-   Docker and Docker Compose installed on your machine
-   Git (to clone the repository)

### Running with Docker Compose (Production)

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd movement-admin
    ```

2. Create a `.env.local` file with your environment variables:

    ```bash
    cp .env.docker .env.local
    # Edit .env.local with your configuration
    ```

3. Build and start the containers:

    ```bash
    docker-compose up -d
    ```

4. Access the application at http://localhost:3000

### Running with Docker Compose (Development)

For development with hot reloading:

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd movement-admin
    ```

2. Create a `.env.local` file with your environment variables:

    ```bash
    cp .env.docker .env.local
    # Edit .env.local with your configuration
    # Make sure to set NODE_ENV=development
    ```

3. Build and start the containers using the development configuration:

    ```bash
    docker-compose -f docker-compose.dev.yml up -d
    ```

4. Access the application at http://localhost:3000

5. The application will automatically reload when you make changes to the code

### Environment Variables

The application requires several environment variables to function properly:

-   `DATABASE_URL`: PostgreSQL connection string
-   `NEXT_PUBLIC_PROJECT_ID`: Appwrite project ID
-   `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Appwrite API endpoint
-   `TOGETHER_API_KEY`: API key for Together API

For development, you can set these in your `.env.local` file. For production, configure them in your deployment environment or in the docker-compose.yml file.

### Building the Docker Image Manually

If you want to build and run the Docker image without Docker Compose:

```bash
# Build the image
docker build -t movement-admin .

# Run the container
docker run -p 3000:3000 --env-file .env.local movement-admin
```

### Database Migrations

To run database migrations inside the Docker container:

```bash
# For production
docker-compose exec app npx drizzle-kit push:pg

# For development
docker-compose -f docker-compose.dev.yml exec app npx drizzle-kit push:pg
```
