PURGE = rm -rf node_modules
PRUNE = npm ls --depth=0 --only=dev --parseable | xargs basename | tr '\n' ' ' | xargs npm uninstall --no-save

# npm bug causes issues with package-locks + symlinks
# see: https://npm.community/t/issue-npm-install-with-local-packages-and-symlinks-enoent/518/5
# --no-package-lock for now
INSTALL = npm install --no-package-lock
install:
	@echo "\\033[0;31m Run 'npm run bootstrap' to install internal package dependencies.\\033[0m\\n"

ifdef CI
# CI overrides
install: bootstrap
endif

# install node_modules for each package
bootstrap:
	cd marketplace && $(INSTALL)
	cd userpages && $(INSTALL)

# remove all node_modules
purge:
	-rm -Rf node_modules
	-cd eslint-config-streamr && $(PURGE)
	-cd stylelint-config-streamr && $(PURGE)
	-cd streamr-layout && $(PURGE)
	-cd marketplace && $(PURGE)
	-cd userpages && $(PURGE)

##
## TEMPORARY scripts to pull remote changes into monorepo
##

# adds remote for a repo, if not already added

setup:
	$(call setupRemote,userpages)
	$(call setupRemote,marketplace)
	$(call setupRemote,streamr-layout)
	$(call setupRemote,eslint-config-streamr)
	$(call setupRemote,stylelint-config-streamr)

define setupRemote
	(git remote get-url $1 || git remote add -f $1 git@github.com:streamr-dev/$1.git)
endef

pull: setup
	git merge -s recursive -Xsubtree=marketplace marketplace/development
	git merge -s recursive -Xsubtree=userpages editor/master
	git merge -s recursive -Xsubtree=streamr-layout streamr-layout/master
	git merge -s recursive -Xsubtree=eslint-config-streamr eslint-config-streamr/master
	git merge -s recursive -Xsubtree=stylelint-config-streamr stylelint-config-streamr/master

.PHONY: bootstrap purge pull setup

