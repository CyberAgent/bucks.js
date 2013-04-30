#
# bucks.js
#

PROJECTNAME="bucks.js"
DESC="bucks.js"

all: clean test build

check:
	@echo
	@echo "info: checking node_modules."
	if [ ! -d ./node_modules ]; then npm install .; else exit 0; fi

test: check
	@echo
	@echo "info: testing start."
	./node_modules/mocha/bin/mocha --reporter spec test/

build:
	@echo
	@echo "info: build start."
	./build.sh

clean:
	@echo
	@echo "info: clean start."
	rm -f bucks.min.js

.PHONY: all test build clean
