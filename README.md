```
,
|\
\ |
 | \ /
  \|/    _,     OPENSOURCE MESSENGER PROJECT
   /  __/ /      _____________   __   __ __
  | _/ _.'      / __/_  __/ _ | / /  / //_/
  |/__/        _\ \  / / / __ |/ /__/ ,<
   \          /___/ /_/ /_/ |_/____/_/|_|
```

# stalk.messenger

프로젝트 개발 1차 완료 시점에 github.com/xpush 로 이동 예정 (아래 3가지로 분리되어 이관)

### 1. s5messenger

react-native 기반의 모바일 메신져

### 2. s5server-session

**parse-server & express & xpush 로 구현된 session 서버**

Mongodb, redis, zookeeper 가 사전에 실행해야 함.

```
## 서버 실행하기.
$ ./s5server-session/bin/session-server --config ./config.local.json
```

### 3. s5server-channel

구현하고 있음.
