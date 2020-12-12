# DateAway Magenta Skill (TEAM_02)

This is skill repository made for the Remote Rhapsody Hackathon by hubraum, BeMyApp & Deutsche Telekom. The idea of the skill is to connect users by asking them personalized questions made by users themselves. As soon as their answers align, they receive a match and are able to get personal contacts, for ex. Instagram username.

### Available intents
1. `Add your personal question`: Hallo Magenta, füge eine Frage hinzu. (Will ask what your question is and how you would answer to it)
2. `Ask you a question from your potential match`: Hallo Magenta, stell mir eine DateAway Frage. (Will ask you what your answer is)
3. `How many open questions do I have`: Hallo Magenta, wie viele Fragen habe ich?
4. `How many matches do I have`: Hallo Magenta, geh mal durch meine Matches.
5. `Get the personal contacts of your latest match`: Hallo Magenta, was sind die Kontakte meines letzten Matches?
See full list on https://github.com/magenta-voice/hackathon-conf/tree/master/TEAM_02

### How to launch locally
The docker-composer.yml file:
1. Starts a MySQL server container based on the [official image](https://hub.docker.com/_/mysql/),
2. Starts a [Node.js 10.8.0](https://hub.docker.com/_/node/) app that waits for the database to become responsive, and run all migrations and seeds if necessary,
3. Starts a Magenta skill

You only need to have [Docker](https://www.docker.com/) installed in your computer, nothing else.
The docker-compose.yml file creates a bind mount directoty that allows you to test anything live, just change the code for the server or client and it will immediately become available.

The data for the MySQL will persist between launches.

To bring the project up first [install Docker](https://www.docker.com/), then run:

```
docker-compose up
```

The docker-compose.yml will host the Magenta skill on port `4242`, the Express app on port `5000` & MySQL DB on port `3306` on the Docker environment, so once the system is up just go to http://localhost.

To bring it down:

```
docker-compose down -v
```

If you change your Dockerfile and must rebuild the Node.js or React images, run:

```
docker-compose up --build
```
