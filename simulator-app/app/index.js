const axios = require('axios');

AVAILABLE_MODELS               = ["BMW", "VW", "MERCEDES"]
AVAILABLE_TYPES                = ["SEDAN", "SUV", "CABRIOLET"];
AVAILABLE_COLORS               = ["RED", "GREEN", "BLACK", "BLUE"];
AVAILABLE_INFOTAINMENT_SYSTEMS = ["CD", "CASSETTE", "BLUETOOTH"];

function decideMovement({x, y}) {
  const calculateDistance = ({xDestination,yDestination}) => {
    return Math.sqrt((x - xDestination) * (x - xDestination) + (y - yDestination) * (y - yDestination));
  }
  
  const {xDestination} = Math.max(calculateDistance({xDestination: 0,yDestination: 0}, {xDestination: 100, yDestination: 100} ))
  const options = xDestination ? [{xDirection: 0, yDirection: -1}, {xDirection: -1, yDirection: -1}, {xDirection: 0, yDirection: -1}] :
                              [{xDirection: 0, yDirection: 1}, {xDirection: 1, yDirection: 1}, {xDirection: 0, yDirection: 1}]


  return {...options[Math.floor(Math.random()*options.length)]}
}

async function createCars() {
  let cars                = [];
  let carCreationPromises = [];
  
  for(let i = 0 ; i < 20; i++) {
    carCreationPromises.push(
      axios.post('http://cars-app:3000/cars', {
        car: {
          model:              AVAILABLE_MODELS[Math.floor(Math.random()*AVAILABLE_MODELS.length)],
          type:               AVAILABLE_TYPES[Math.floor(Math.random()*AVAILABLE_MODELS.length)],
          color:              AVAILABLE_COLORS[Math.floor(Math.random()*AVAILABLE_MODELS.length)],
          infotainmentSystem: AVAILABLE_INFOTAINMENT_SYSTEMS[Math.floor(Math.random()*AVAILABLE_MODELS.length)],
          engineNumber:       `${Math.random().toString(36).substr(2,1)}-${Math.random().toString(36).substr(2, 6)}`,
          location:           {x: Math.floor(Math.random()*100), y: Math.floor(Math.random()*100)},
          isLeatherInterior:  Math.random() >= 0.5
        }
      })
      .then( (response) => {
        cars.push({id: response.data._id, direction: decideMovement(response.data.location)});
      })
      .catch((response) => {
        console.log(response);
      })
    );
  }

  return await Promise.all(carCreationPromises).then(() => cars);
}

async function moveCars(cars) {
  const move = ({x, y}, {xDirection, yDirection}) => {
    const newX = x + xDirection;
    const newY = y + yDirection;
    if(newX < 0 || newY < 0 || newX > 100 || newY > 100) return;

    return {x: newX, y: newY};     
  }

  let movementPromises = []
  while(true){
    let updated = 0
    for(let i = 0; i< cars.length; i++) {
      const {id, direction} = cars[i];
      const {location}        = (await axios.get(`http://cars-app:3000/cars/${id}`)).data;
      const newLocation       = move(location, direction); 
  
      if(newLocation) {
        await axios.patch(`http://cars-app:3000/cars/${id}`, {
          car: {
            location: newLocation
          }
        });
        updated ++;
        console.log(newLocation);
        await new Promise( (resolve) => setTimeout(() =>{resolve()}, 500))
      }
    }
    if (!updated) break;
  }


  return await Promise.all(movementPromises)
}

async function simulateMovement() {
  console.log("starting simulation...");
  const cars = await createCars();
  await moveCars(cars);
  console.log("simulation ended");
}


// Create an instance of the http server to handle HTTP requests
setTimeout(async () => {
  await simulateMovement();
})