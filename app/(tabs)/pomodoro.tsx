import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useState, useEffect } from "react";
import Svg, { Circle } from "react-native-svg";

export default function Pomodoro() {
  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");

  const INITIAL_TIME = 25 * 60;
  const isStopped = !isRunning && secondsLeft === INITIAL_TIME;

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(25 * 60);
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 0) {
          if (mode === "work") {
            setMode("break");
            return BREAK_TIME;
          } else {
            setMode("work");
            return WORK_TIME;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  return (
   <View style={style.container}>
  <Text style={style.sessionText}>
    {mode === "work" ? "Work Time 🍅" : "Break Time ☕"}
  </Text>

  <View style={style.timerView}>
    <Text style={style.timeText}>{formatTime(secondsLeft)}</Text>
  </View>

  <View style={style.buttonView}>
    {!isRunning && (
      <Button
        style={style.button}
        contentStyle={{ height: 50 }}
        labelStyle={style.buttonText}
        onPress={handleStart}
        mode="contained"
      >
        {secondsLeft === INITIAL_TIME ? "Start" : "Resume"}
      </Button>
    )}

    {isRunning && (
      <Button
        style={style.button}
        contentStyle={{ height: 50 }}
        labelStyle={style.buttonText}
        onPress={handlePause}
        mode="contained"
      >
        Pause
      </Button>
    )}

    {!isStopped && (
      <Button
        style={style.button}
        contentStyle={{ height: 50 }}
        labelStyle={style.buttonText}
        onPress={handleStop}
        mode="contained"
      >
        Stop
      </Button>
    )}
  </View>
</View>

  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sessionText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timerView: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  timeText: {
    fontSize: 72,
    fontWeight: "bold",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});


function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}
