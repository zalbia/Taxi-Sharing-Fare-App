import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import GoogleMap from "google-map-react";
import getConfig from "next/config";
import * as React from "react";
import GoogleMapsApi from "../../../@types/GoogleMapsApi";
import { Result } from "../../../redux/State";

export interface RideProps {
  id: string;
}

type Props = RideProps;

const {
  publicRuntimeConfig: {
    google: {
      api: { key }
    }
  }
} = getConfig();

interface RideState {
  duration: number; // in seconds
  finished: boolean;
  startTime?: Date;
  timer?: any;
  timerRunning: boolean;
}

const tenMinutes = 600; // seconds

class Ride extends React.Component<Props> {
  state: RideState = { duration: 0, finished: false, timerRunning: false };
  private startTimer = () => {
    const timer = setInterval(() => {
      const now = new Date();
      const duration = (now.getTime() - this.state.startTime.getTime()) / 1000;
      this.setState({ duration });
    }, 1000);
    this.setState({
      startTime: new Date(),
      timer,
      timerRunning: true
    });
  };

  private stopTimer = () => {
    clearInterval(this.state.timer);
    this.setState({ finished: true, timerRunning: false });
  };

  render() {
    const { id } = this.props;
    const result = JSON.parse(localStorage.getItem(`ride-${id}`)) as Result;
    const { duration, finished, timerRunning } = this.state;
    const players =
      duration >= tenMinutes
        ? result.result.tenMinPlayers
        : result.result.zeroMinPlayers;
    const { legs } = result.directionsResult.routes[0];
    const distance = legs.reduce((s, l) => s + l.distance.value, 0);
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return (
      <>
        <div
          style={{
            height: "calc(100vh - 104px)",
            padding: 0,
            position: "relative",
            width: "100%",
            zIndex: 1
          }}
        >
          <GoogleMap
            bootstrapURLKeys={{
              key
            }}
            defaultCenter={{
              lat: 26.1065941,
              lng: 50.5093452
            }}
            defaultZoom={10}
            onGoogleApiLoaded={({ map }: GoogleMapsApi) => {
              const directionsDisplay = new google.maps.DirectionsRenderer();
              directionsDisplay.setMap(map);
              directionsDisplay.setDirections(result.directionsResult);
            }}
            yesIWantToUseGoogleMapApiInternals={true}
          />
          <div>
            <Typography variant="subheading" gutterBottom={true}>
              Ride Itinerary
            </Typography>
            <div>
              <Typography variant="caption">Origin</Typography>
              <Typography gutterBottom={true}>
                {result.taxiRide.origin.query}
              </Typography>
              <Typography variant="caption">Destination</Typography>
              <Typography gutterBottom={true}>
                {result.taxiRide.destination.query}
              </Typography>
              <Typography variant="caption">Distance</Typography>
              <Typography gutterBottom={true}>{distance / 1000} km</Typography>
              <Typography variant="caption">Passengers:</Typography>
              {players.map(p => {
                return (
                  <Typography key={p.id} gutterBottom={true}>
                    {p.name} - BD {p.fare / 1000} - {p.distance / 1000} km
                  </Typography>
                );
              })}
              <Typography variant="caption">Duration</Typography>
              <Typography>
                {minutes}:{paddedSeconds}
              </Typography>
            </div>
            {!finished &&
              (timerRunning ? (
                <Button onClick={this.stopTimer} variant="contained">
                  End Ride
                </Button>
              ) : (
                <Button onClick={this.startTimer} variant="contained">
                  Start Ride
                </Button>
              ))}
          </div>
        </div>
      </>
    );
  }
}

export default Ride;
