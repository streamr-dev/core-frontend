INSTALL = npm i
PURGE = rm -rf node_modules
PRUNE = npm ls --depth=0 --only=dev --parseable | xargs basename | tr '\n' ' ' | xargs npm uninstall --no-save

# install node_modules for each package
bootstrap:
	cd eslint-config-streamr && $(INSTALL)
	cd stylelint-config-streamr && $(INSTALL)
	cd streamr-layout && $(INSTALL)
	cd marketplace && $(INSTALL)
	cd editor && $(INSTALL)

# remove all node_modules
purge:
	-rm -Rf node_modules
	-cd eslint-config-streamr && $(PURGE)
	-cd stylelint-config-streamr && $(PURGE)
	-cd streamr-layout && $(PURGE)
	-cd marketplace && $(PURGE)
	-cd editor && $(PURGE)

# temporary scripts to pull remote changes into monorepo
setup:
	git remote add -f editor git@github.com:streamr-dev/editor.git
	git remote add -f marketplace git@github.com:streamr-dev/marketplace.git
	git remote add -f streamr-layout git@github.com:streamr-dev/streamr-layout.git
	git remote add -f eslint-config-streamr git@github.com:streamr-dev/eslint-config-streamr.git
	git remote add -f stylelint-config-streamr git@github.com:streamr-dev/stylelint-config-streamr.git

pull: setup
	git merge -s recursive -Xsubtree=editor editor/master
	git merge -s recursive -Xsubtree=marketplace marketplace/master
	git merge -s recursive -Xsubtree=streamr-layout streamr-layout/master
	git merge -s recursive -Xsubtree=eslint-config-streamr eslint-config-streamr/master
	git merge -s recursive -Xsubtree=stylelint-config-streamr stylelint-config-streamr/master

.PHONY: bootstrap purge pull setup

