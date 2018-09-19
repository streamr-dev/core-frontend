##
## TEMPORARY scripts to pull remote changes into monorepo
##

# adds remote for a repo, if not already added

setup:
	$(call setupRemote,editor)
	$(call setupRemote,marketplace)
	#$(call setupRemote,streamr-layout)
	#$(call setupRemote,eslint-config-streamr)
	#$(call setupRemote,stylelint-config-streamr)

define setupRemote
	(git remote get-url $1 || git remote add -f $1 git@github.com:streamr-dev/$1.git)
endef

pull: setup
	-mkdir -p app/src/
	git subtree add --prefix=app/src/marketplace marketplace/development
	git subtree add --prefix=app/src/userpages editor/master
	#git subtree add --prefix=app/src/shared streamr-layout/master

.PHONY: pull setup
