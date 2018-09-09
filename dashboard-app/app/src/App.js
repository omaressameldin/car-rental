import React, { Component } from "react";
import socketIOClient       from "socket.io-client";
import {Bar, Bubble}        from 'react-chartjs-2';

class App extends Component {
static dynamicColor() {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};  

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
    socket.on("CarUpdated", ({_id, location, traveledDistance}) => {
      this.setState((state) => {
        let cars = state.cars.map((car) => {
          return (car._id == _id) ? {...car, location, traveledDistance} : car;
        });

        return {cars};
      });
    });

    socket.on("CarCreated", newCar => {
      this.setState((state) => ({cars: [...state.cars, {...newCar, color: App.dynamicColor()}]}));
    });    
  }

  render() {
    const {cars} = this.state
    if(!cars.length) return  (<p style={{ textAlign: "center" }}>Loading...</p>); 

    const distanceData = {
      labels: cars.map(({_id}) => _id),
      datasets: [
        {
          label: 'Traveled Distances',
          backgroundColor: cars.map(({color}) => color),
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: cars.map(({traveledDistance}) => traveledDistance)
        }
      ]
    };

    const options = {
      scales: {
        yAxes: [{
          ticks: {
              beginAtZero:true,
              min: 0,
              max: 100    
          }
        }]
      }
    };

    const positionData = {
      labels: cars.map(({_id}) => _id),
      datasets: [
        {
          label: 'Car Locations',
          fill: false,
          lineTension: 0.1,
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          backgroundColor: cars.map(({color}) => color),
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: cars.map(({location}) => ({...location, r: 5}))
        }
      ]
    };

    return(
      <div>
        <h2 style={{ textAlign: "center" }}>Traveled Distances</h2>
        <Bar
          data={distanceData}
          width={100}
          height={25}
          options={options}
        />

        <h2 style={{ textAlign: "center" }}>Car Postiions</h2>
        <Bubble 
          width={100}
          height={25}        
          data={positionData} 
        />  
      </div>
    )
  }
}
export default App;