# STALK SERVER

### Run session server

```
export VERBOSE=1  # logging verbose
./bin/session-server --config ./config.local.json
```

### Run channel server

```
export VERBOSE=1  # logging verbose
./bin/channel-server --config ./config.local.json
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
