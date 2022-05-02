
install: install-server install-ui hooks

start:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

clean:
	docker-compose kill && docker system prune --force --volumes

test-server:
	yarn --cwd server test

test-ui:
	yarn --cwd ui test:ci

test: test-server test-ui

coverage-server:
	yarn --cwd server coverage

coverage-ui:
	yarn --cwd ui coverage

coverage: coverage-server coverage-ui

lint-server:
	yarn --cwd server lint

lint-ui:
	yarn --cwd ui lint

lint: lint-server lint-ui

install-server:
	yarn --cwd server install --frozen-lockfile

install-ui:
	yarn --cwd ui install --frozen-lockfile

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

start-mongodb:
	docker-compose up -d mongodb

ci: install lint start-mongodb coverage clean
