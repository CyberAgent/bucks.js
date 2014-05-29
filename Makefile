#
# bucks.js
#

PROJECTNAME="bucks.js"
DESC="bucks.js"

all: clean test build jsdoc

check:
	@echo
	@echo "info: checking node_modules."
	if [ ! -d ./node_modules ]; then npm install .; else exit 0; fi

test: check
	@echo
	@echo "info: testing start."
	./node_modules/mocha/bin/mocha --reporter spec test/*.js

build:
	@echo
	@echo "info: build start."
	./build.sh

jsdoc:
	@echo
	@echo "info: jsdoc create"
	./node_modules/.bin/jsdoc -c .jsdoc3.json -d docs -p -r -l -t node_modules/ink-docstrap/template bucks.js
clean:
	@echo
	@echo "info: clean start."
	rm -f bucks.min.js
	rm -rf docs

.PHONY: all test build clean
