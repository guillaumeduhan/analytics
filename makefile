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
	git pull origin main
	cd API && npm run build && pm2 restart all
