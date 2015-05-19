BOWER 		?= node_modules/.bin/bower
JSHINT 		?= node_modules/.bin/jshint
HTTPSERVE   ?= node_modules/.bin/http-server
PHANTOMJS	?= node_modules/.bin/phantomjs

SOURCES	= $(wildcard src/*.js)

all:: designerhappy

########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

stamp-bower: stamp-npm
	$(BOWER) install
	touch stamp-bower

clean::
	rm -f stamp-npm stamp-bower
	rm -rf node_modules src/bower_components ~/.cache/bower


designerhappy:: stamp-npm stamp-bower
	@printf "\n\n Designer, you can be happy now.\n Go to http://localhost:4001/ to see a demo \n\n\n\n"
	$(HTTPSERVE) -p 4001

make serve:: stamp-npm stamp-bower
	$(HTTPSERVE) -p 4001

########################################################################
## Tests

#check:: jshint
#jshint: stamp-npm
#	$(JSHINT) --config jshintrc $(SOURCES)

check:: stamp-npm
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests.html
