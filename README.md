# Creatingly Back-End Assessment
This repository represents a custom `session middleware` for `Express.JS` framework.

## Features
- Silently creates session for anonymous users who are visiting currency exchange rates.
- Counts visits of every user in session store.
- User can add currency symbols to his/her watchlist.
- Shows user selected exchange rates depending on user's watchlist.

## Session Middleware
Session middleware is an `in-memory` implementation including `loading and saving backup`.
- Loads sessions backup to memory in initial state.
- User session is accessible in request object on every route.
- Saves sessions backup every period of time provided in config settings. `default is 60 seconds`
- Saves sessions in case of application `exit` such as `Ctrl+C`.

### Known Issues
- User sessions has no expiration time so they remain forever in memory and session store.
- By growing the count of users and session properties, may experience memory leaks and high server resource usage.
- Session backup is not encoded and can be modified unsecurely.

## ToDo and Future Improvements
The following tasks can be implemented for security and performance improvements:
- Session backup must be encoded for more security.
- Restoring backup in initial state must be validated before use.
- User session must be saved in separate encoded file to prevent memory leaks and server high memory usage.
- User sessions may have expiration time and be removed after a period of time.
- Using a separate noSQL server such as `Redis` or `MongoDB` as session storage.

## Demo Routes
Base url and port is `http://localhost:5000`
* `[GET] /` returns all available currency exchange rates. `Counts user visits`
* `[GET] /watchlist` returns currency exchange rates selected in user watchlist. `Counts user visits`
* `[PUT] /watchlist` stores a list of user selected currency symbols in user watchlist.
* `[GET] /session` returns whole user session storage object.

### Tests
A postman collection is provided for tests in root folder as `postman-collection.json`.