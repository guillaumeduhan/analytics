gt: ## git add, commit, push and build
	git add .
	git commit -m "commit"
	git push origin HEAD
	yarn build

gtc: ## git pull then push changes
	git pull --no-ff
	make gt

gm: ## switch to main and pull
	git switch main
	git pull origin main

gmc: ## update main and return back
	make gm
	git checkout -

branch: ## create new branch, use: make branch name=your-branch
	git checkout -b $(name)

dev: ## run dev server
	yarn dev

build: ## production build check
	yarn && yarn build

run: ## build and run server
	yarn build && yarn start

check: ## lint, test, build
	yarn lint && yarn test && yarn build
