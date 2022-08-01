# Docker
up:
	@docker compose up --build -d

down:
	@docker compose down -v

# Local
build:
	@docker compose run --rm -i node sh -c 'npm ci && npm run build'

start: build
	@docker compose run --rm -p 4000:4000 -i dev sh -c 'jekyll s'
