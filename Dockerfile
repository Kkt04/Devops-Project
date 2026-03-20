FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's layer caching mechanism
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the Prisma schema and generate the Prisma Client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application files to the container
COPY . .

# Expose the application port (matching the 5001 used in GitHub Actions)
EXPOSE 5001

# Command to run the Express backend
CMD ["npm", "start"]