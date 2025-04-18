#!/bin/sh

echo "Waiting for database to be ready..."
while ! nc -z db 5432; do
  sleep 0.1
done
echo "Database is ready!"

echo "Running database migrations and seeds..."
yarn typeorm migration:run -d src/config/database.ts || true
node -e "require('./dist/database/seeds/BeerStyleSeeder.js').seedBeerStyles().catch(console.error)"

echo "Starting application..."
yarn dev