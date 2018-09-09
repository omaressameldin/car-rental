import React, { Component, Fragment } from "react";
import socketIOClient       from "socket.io-client";

class App extends Component {
  constructor() {
    super();
    this.state = {
      cars: [],
      endpoint: "http://localhost:15001"
    };
  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("CarUpdated", updatedCar => {
      this.setState((state) => {
        let cars = state.cars.map((car) => {
          console.log( updatedCar.location);
          return (car._id == updatedCar._id) ? {...car, location: updatedCar.location} : car;
        });

        return {cars};
      });
    });

    socket.on("CarCreated", newCar => {
      this.setState((state) => ({cars: [...state.cars, newCar]}));
    });    
  }

  render() {
    const {cars} = this.state
    if(!cars.length) return  (<p style={{ textAlign: "center" }}>Loading...</p>);
    
    return (
      <Fragment>
        {
          cars.map(({location, i}) => {
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <p>The temperature in Florence is: {location.x} {location.y} °F</p>
              </div>
            );
          })          
        }
      </Fragment>
    )

  }
}
export default App;