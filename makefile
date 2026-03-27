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
	rm -f frontend/package-lock.json frontend/yarn.lock
	npm install -g yarn || true
	git pull origin main
	cd API && npm install && npm run build
	cd frontend && npm install && npm run build
	pm2 delete all || true
	kill $$(lsof -ti:4200) 2>/dev/null || true
	kill $$(lsof -ti:3000) 2>/dev/null || true
	pm2 start ecosystem.config.js && pm2 save
