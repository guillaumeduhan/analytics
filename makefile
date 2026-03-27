# Makefile by @codewithguillaume
gt:
	git add .
	git commit -m "commit"
	git push origin

gtc:
	git pull --no-ff
	make gt

gr:
	git rebase main

gm:
	git switch main
	git pull

gmc:
	make gm
	git checkout -

dev:
	npm run start:dev

deploy:
	rm -f frontend/package-lock.json
	git pull origin main
	cd API && npm run build
	cd frontend && npm run build
	pm2 delete all && pm2 start ecosystem.config.js && pm2 save
