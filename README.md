**이 프로젝트는 개발 중입니다. 동작하지 않으며, clone 받지 말아주세요. 빨리 개발해서 정식 릴리즈 하도록 하겠습니다.**

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
$ export VERBOSE=1  # 로깅 verbose
$ ./s5server-session/bin/session-server --config ./config.local.json

## parse-dashboard 실행하기. ( 실행 후 `http://[host]:4040/dashboard` 로 접속)
$ ./s5server-session/bin/parse-dashboard --config ./s5server-session/config.local.json
```

### 3. s5server-channel

Mongodb, redis, zookeeper 가 사전에 실행해야 함.

```
## 서버 실행하기.
$ ./s5server-channel/bin/channel-server --config ./s5server-channel/config.local.json
```

## TODO List

기능 위주로 우선 아래와 같이 구현을 목표로 함 (나중에 UI 개발)

##### 기본 기능
- [x] 회원 가입
- [x] 로그인
- [x] 로그아웃

##### 데이터 모델링
- [x] parse object 데이터 모델링 (Relation 관계 정의)
- [x] samples 데이터 생성 스크립드 작성
- [x] Relational Diagram 작업

##### Follows Tab
- [x] GiftedListView Sample 코드 구현 (Follows Tab, Search Popup List View)
- [x] Parse.Users 목록 조회 기능 구현 (Users relation mapping schema)
- [x] Remove Follow (친구 삭제) 구현
- [ ] Add Follow (친구 추가) 구현
- [ ] Favorite Follow 구현

##### Chats Tab
- [x] GiftedListView Sample 코드 구현
- [x] GiftedMessenger Sample 코드 구현
- [x] Chats 목록 조회 기능 구현
- [ ] Leave Chats(채팅방 삭제) 기능 구현
- [ ] 그룹 Chat 에 대한 다수 Profile 이미지 노출 컨포넌트 구현
- [ ] Chat View 화면 구현
- [ ] 이전 메시지 로딩 기능 구현
- [ ] Read(읽음) 표시 기능 구현

##### Profile Tab
- [x] Profile 이미지 업로드 구현
- [x] Profile 관리 기능 구현

##### ** Design **
- [x] 디자이너 섭외
