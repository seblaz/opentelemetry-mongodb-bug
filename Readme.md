# OpenTelemetry Mongodb hierarchy bug

This repo demostrate a bug present in the [@opentelemetry/instrumentation-mongodb](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-mongodb).

Steps to reproduce:

1. Start the app:
```shell
docker-compose up -d
``` 

2. Generate a bit of workload:
```shell
ab -c 15 -n 15 http://localhost:4000/mongo
```

3. Check the spans in the console:
```shell
docker-compose logs app | grep -B1 mongodb.find | grep parentId: | sort | uniq -c
```
Every span that has the `mongodb.find` name should have a different `parentId` because every call is generated from a different request. Nevertheless, there are some spans that have the same `parentId`:

```
   1 app_1    |   parentId: '105b3b013c268532',
   1 app_1    |   parentId: '349d66202944de24',
   1 app_1    |   parentId: '70c96c11a9d99341',
   1 app_1    |   parentId: 'a86618afaf588174',
   6 app_1    |   parentId: 'aac70dccf6119502',
   1 app_1    |   parentId: 'b5e765d2b29022d2',
   1 app_1    |   parentId: 'bb888957c792d0f6',
   1 app_1    |   parentId: 'bbd925d7fd7eb2d3',
   1 app_1    |   parentId: 'c8f10ddab420a7fd',
   1 app_1    |   parentId: 'f1f5492794308b3a',
   1 app_1    |   parentId: 'f445c3707d0f91b6',
```

At the same time, there are some parent spans that don't have a child span with the mongo span:

```shell
docker-compose logs app | grep -A1 'GET /mongo' | grep id: | sort | uniq -c
```

Output:
```
   1 app_1    |   id: '105b3b013c268532',
   1 app_1    |   id: '2691e8764a95e761',
   1 app_1    |   id: '349d66202944de24',
   1 app_1    |   id: '4c134aecc38c7add',
   1 app_1    |   id: '5b8762341307d660',
   1 app_1    |   id: '70c96c11a9d99341',
   1 app_1    |   id: '731277fde86f341f',
   1 app_1    |   id: 'a86618afaf588174',
   1 app_1    |   id: 'aac70dccf6119502',
   1 app_1    |   id: 'b5e765d2b29022d2',
   1 app_1    |   id: 'bb888957c792d0f6',
   1 app_1    |   id: 'bbd925d7fd7eb2d3',
   1 app_1    |   id: 'c8f10ddab420a7fd',
   1 app_1    |   id: 'f1f5492794308b3a',
   1 app_1    |   id: 'f33dbc04307e1cb3',
   1 app_1    |   id: 'f445c3707d0f91b6',
```

In my case, this happened only when there are more than 15 concurrent requests.
