# Stage 1: Build
FROM node:22-alpine AS build

# Set the working directory inside the container for the build stage
WORKDIR /build

# Copy package.json and package-lock.json (if available)
COPY package.json ./

# Install dependencies
RUN npm install --production=false

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run
FROM node:22-alpine

# Set the working directory inside the container for the run stage
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/package.json ./package.json
COPY --from=build /build/next.config.js ./next.config.js

# Expose the port that the application will run on
EXPOSE 3001

# Command to run the application
CMD ["npm", "start"]
