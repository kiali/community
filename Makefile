SHELL=/bin/bash

# Directories based on the root project directory
ROOTDIR=$(CURDIR)

build:
	@cd ${ROOTDIR}/website && yarn install --frozen-lockfile && yarn run build

generate_event_json:
	python scripts/create_event_json.py		

generate_metrics_json:	
	python scripts/api_gh/pull_api_data.py	