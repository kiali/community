SHELL=/bin/bash

# Directories based on the root project directory
ROOTDIR=$(CURDIR)

build:
	@cd ${ROOTDIR}/website && yarn install --frozen-lockfile && yarn run build