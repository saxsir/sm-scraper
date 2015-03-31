DATE=$(shell date '+%F_%H-%M-%S')

all:

run:
	node search.js 'WEB 制作 株式会社' > log/search-result.$(DATE).txt
	cp log/search-result.$(DATE).txt log/search-result.latest.txt
	casperjs gather.js > log/gather-result.$(DATE).txt
	cp log/gather-result.$(DATE).txt log/gather-result.latest.txt

