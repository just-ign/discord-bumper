import React, { useState } from "react";
import bumper from "../assets/bump.png";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import Divider from "./Divider";
import Button from "@material-ui/core/Button";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import moment from "moment";
const { ipcRenderer } = window.require("electron");

const Landing = () => {
  const [selectedDate, setSelectedDate] = useState(Date.now());
  const [remainingSetTime, setRemainingTime] = useState(5);
  const [session, setSession] = useState(false);
  const interval = 10;

  const handleComplete = () => {
    ipcRenderer.send("bump");
    return [true, 0];
  };

  const handleDate = (date) => {
    setSelectedDate(date);
    if (date > Date.now()) {
      const seconds = Math.abs(date - Date.now()) / 1000;
      setRemainingTime(seconds);
    }
  };

  const renderTime = (seconds) => {
    const duration = moment
      .utc(moment.duration(seconds, "seconds").asMilliseconds())
      .format("HH:mm:ss");
    return (
      <div className="rendered-time">
        <div>{duration}</div>
        <div>Till I Bump!</div>
      </div>
    );
  };

  return (
    <div className="main-container">
      <img className="bumper-image" src={bumper} alt="bumper" />
      <Divider />
      {!session ? (
        <div className="main-container">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              variant="dialog"
              label="Select Start Time"
              value={selectedDate}
              onChange={handleDate}
              KeyboardButtonProps={{
                "aria-label": "Select Start Time",
              }}
            />
          </MuiPickersUtilsProvider>
          <Divider />
          <Button
            onClick={() => setSession(true)}
            variant="contained"
            color="primary"
          >
            Start
          </Button>
        </div>
      ) : (
        <div className="main-container">
          <CountdownCircleTimer
            isPlaying
            duration={interval}
            initialRemainingTime={remainingSetTime}
            onComplete={handleComplete}
            colors={[
              ["#283c86", 0.33],
              ["#366E67", 0.33],
              ["#45a247", 0.33],
            ]}
          >
            {({ remainingTime }) => renderTime(remainingTime)}
          </CountdownCircleTimer>
          <Divider />
          <Button
            onClick={() => setSession(false)}
            variant="contained"
            color="primary"
          >
            Stop
          </Button>
        </div>
      )}
    </div>
  );
};

export default Landing;
