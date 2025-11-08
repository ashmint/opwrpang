.PHONY: build build-pg build-release build-arm build-x86 test clean

build-release:
	@if [ -z "$(tag)" ]; then \
		echo "Error: tag is required. Usage: make build-release tag=<tag>"; \
		exit 1; \
	fi
	docker buildx build --build-arg DATABASE=sqlite --platform linux/amd64 -t ashmint97/opwrpang:latest --push .
	docker buildx build --build-arg DATABASE=sqlite --platform linux/amd64 -t ashmint97/opwrpang:$(tag) --push .
	docker buildx build --build-arg DATABASE=pg --platform linux/amd64 -t ashmint97/opwrpang:postgresql-latest --push .
	docker buildx build --build-arg DATABASE=pg --platform linux/amd64 -t ashmint97/opwrpang:postgresql-$(tag) --push .

build-arm:
	docker buildx build --platform linux/arm64 -t ashmint97/opwrpang:latest .

build-x86:
	docker buildx build --platform linux/amd64 -t ashmint97/opwrpang:latest .

build-sqlite:
	docker build --build-arg DATABASE=sqlite -t ashmint97/opwrpang:latest .

build-pg:
	docker build --build-arg DATABASE=pg -t ashmint97/opwrpang:postgresql-latest .

test:
	docker run -it -p 3000:3000 -p 3001:3001 -p 3002:3002 -v ./config:/app/config ashmint97/opwrpang:latest

clean:
	docker rmi pangolin
