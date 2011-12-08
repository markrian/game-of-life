JS_ENGINE = $(shell which jslint)
SRC_FILE = "life.js"
JSLINT_FLAGS = --goodparts

lint:
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking ${SRC_FILE} against JSLint..."; \
		${JS_ENGINE} ${JSLINT_FLAGS} life.js; \
		else \
			echo "You must have NodeJS and the jslint module installed in order to test ${SRC_FILE} against JSLint."; \
		fi
