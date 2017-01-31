Manage Contest:
retrieve all contest:
  GET http://netsos/api/contest

manipulate contest;
  POST http://netsos/api/contest/admin
  with form data:
    supersecret  : 'netsos_over_ristek'
    action  : [create|update|delete|scrap]

    if action == 'create':
      name        : new name
      description : new description
      active      : [0|1]
      url         : 'playground'
      startTime   : unixTime * 1000
      endTime     : unixTime * 1000

    if action == 'update':
      id          : contest id
      name        : new name [optional]
      description : new description [optional]
      active      : [0|1|optional]
      startTime   : unixTime * 1000 [optional]
      endTime     : unixTime * 1000 [optional]

    if action == 'delete':
      id          : contest id
      name        : new name [for validation]      

    if action == 'scrap':   // sync scoreboard data
      id          : contest id