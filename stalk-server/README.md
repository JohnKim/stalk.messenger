# STALK SERVER

### Run session server

```
export VERBOSE=1  # logging verbose
./bin/start --session
```

### Run channel server

```
./bin/start --channel
```

### Run parse-dashboard

Install the dashboard from `npm`.

```
npm install -g parse-dashboard
```

You can launch the dashboard for an app with a single command by supplying an app ID, master key, URL, and name like this:

```
parse-dashboard --appId STALK --masterKey s3cR3T --serverURL "http://localhost:8080/parse" --appName S5Messenger
```



## using Docker container
```
docker run -d -p 27017:27017 --name mongo mongo
docker run -d -p 6379:6379 --name redis redis

docker build -t s5platform/stalk-server .
docker run -d -e TYPE=session -p 8080:8080 --name session-server s5platform/stalk-server
```
