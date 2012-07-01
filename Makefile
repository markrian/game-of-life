JS_ENGINE = $(shell which jslint)
JS_FILES = "life.js" \
		   "patterns.js"
JSLINT_FLAGS = --goodparts \
			   --indent 4

lint:
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking ${JS_FILES} against JSLint..."; \
		${JS_ENGINE} ${JSLINT_FLAGS} ${JS_FILES}; \
		else \
			echo "You must have NodeJS and the jslint module installed in order to test against JSLint."; \
		fi
