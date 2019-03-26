# Readme

## What this is
- A car rental app
- the app has services for adding/removing cars, demands and users (no front end for that part)
- there is also a service for scheduling the cars according to the demands
- there are also a simulator and dashboard apps where the simulator creates some cars and then starts moving them randomly and the dasboard shows the movements of the cars in the x and y dimensions


## How to use
- make sure you have **docker version 18.x+** installed 
- run `docker-compose up` at the root of the project to launch all services
- once everything is running you'll have the apps running as follows:
  - **users-app**: [localhost:15000](http://localhost:15000) with crud capabilities
    - GET [localhost:15000/users](http://localhost:15000/users)
    - GET [localhost:15000/users/{_id}](http://localhost:15000/users/:id)
    - POST [localhost:15000/users](http://localhost:15000/users) with data in that format:
      ```
      {
        user: {
          name: "omar",
          age: 24,
          ...
        }
      }
      ```
    - PATCH [localhost:15000/users/{_id}](http://localhost:15000/users/:id)
    - DELETE [localhost:15000/users/{_id}](http://localhost:15000/users/:id)

  - **cars-app**: [localhost:15001](http://localhost:15001) with crud capabilities
    - GET [localhost:15001/cars](http://localhost:15001/cars)
    - GET [localhost:15001/cars/{_id}](http://localhost:15001/cars/:id)
    - POST [localhost:15001/cars](http://localhost:15001/cars) with data in that format:
      ```
      {
        car: {
          model: "BMW",
          type: "SEDAN",
          location: {x: 1, y: 2}
          ...
        }
      }
      ```
    - PATCH [localhost:15001/cars/{_id}](http://localhost:15001/cars/:id)
    - DELETE [localhost:15001/cars/{_id}](http://localhost:15001/cars/:id)

  - **demands-app**: [localhost:15002](http://localhost:15002) with crud capabilities
    - GET [localhost:15002/demands](http://localhost:15002/demands)
    - GET [localhost:15002/demands/{_id}](http://localhost:15002/demands/:id)
    - POST [localhost:15002/demands](http://localhost:15002/demands) with data in that format:
      ```
      {
        demand: {
          model: "BMW",
          type: "SEDAN,
          pickupLocation: {xPickup: 1, yPickup: 2},
          pickupTime: "11/2/2018 11:30",
          ...
        }
      }
      ```
    - PATCH [localhost:15002/demands/{_id}](http://localhost:15002/demands/:id)
    - DELETE [localhost:15002/demands/{_id}](http://localhost:15002/demands/:id)
- the **simulator app** is running in the background and if you go to [localhost:15004](http://localhost:15004) you will see a representation of the cars
- The **scheduler-app** [localhost:15003/schedule](http://localhost:15003/schedule)  gives you a schedule of available cars and demands if possible

## RUNNING tests
To run tests for any of the services:
- go to a container using `docker exec -it [app_name] sh`
- run `npm test`

## Technologies used
- node-js (micro)
- react
- socket.io
- ava
- chart.js
- docker
- docker-compose
