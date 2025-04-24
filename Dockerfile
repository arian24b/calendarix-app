# Stage 1: Builder
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies using npm ci for a clean install
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build && \
    cp -r public .next/standalone/ && \
    cp -r .next/static .next/standalone/.next/ && \
    rm -rf /app/tmp /app/cache

# Stage 2: Runner
FROM node:22-alpine AS runner

# Set environment variables using key=value syntax
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user and group for security
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

# Set working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# If you have additional static files or assets, copy them as needed
# COPY --from=builder /app/path/to/your/assets ./assets

# Change ownership of the app directory to the non-root user
RUN chown -R nextjs:nextjs /app

# Switch to the non-root user
USER nextjs

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "server.js"]
