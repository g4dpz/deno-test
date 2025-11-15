FROM denoland/deno:1.45.5

WORKDIR /app

# Copy dependency files
COPY deno.json .

# Cache dependencies
RUN deno cache --reload deno.json || true

# Copy application files
COPY . .

# Cache application dependencies
RUN deno cache main.ts

# Expose port
EXPOSE 8000

# Run the application
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "--env", "main.ts"]
