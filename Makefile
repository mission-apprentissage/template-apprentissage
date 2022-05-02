
install: install-server install-ui hooks

start:
	docker-compose up --build --force-recreate

stop:
	docker-compose stop

clean:
	docker-compose kill && docker system prune --force --volumes

test:
	yarn --cwd server test

coverage:
	yarn --cwd server coverage

lint:
	yarn --cwd server lint

install-server:
	yarn --cwd server install --frozen-lockfile

install-ui:
	yarn --cwd ui install --frozen-lockfile

hooks:
	git config core.hooksPath misc/git-hooks
	chmod +x misc/git-hooks/*

ci: install-server lint coverage
