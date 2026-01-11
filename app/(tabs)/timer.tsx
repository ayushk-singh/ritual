import { View, StyleSheet, Vibration, AppState } from "react-native";
import * as Notifications from "expo-notifications";
import { Button, Text, IconButton } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "react-native-paper";
import { Audio } from "expo-av";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Timer() {
  const theme = useTheme();

  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const format = (n: number) => String(n).padStart(2, "0");

  const getTotalSeconds = () => hours * 3600 + minutes * 60 + seconds;

  const playAlarm = async () => {
    if (soundRef.current) return;

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/alarm.mp3"), // add alaram sound file in assets folder
      { isLooping: true }
    );

    soundRef.current = sound;
    await sound.playAsync();
  };

  const stopAlarm = async () => {
    if (!soundRef.current) return;

    await soundRef.current.stopAsync();
    await soundRef.current.unloadAsync();
    soundRef.current = null;
  };

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    if (!isRunning || !endTime) return;

    intervalRef.current = setInterval(() => {
      const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

      if (diff === 0) {
        clearInterval(intervalRef.current!);
        setIsRunning(false);
        setEndTime(null);

        setHours(0);
        setMinutes(0);
        setSeconds(0);

        Vibration.vibrate([500, 500, 500]);
        playAlarm();
        return;
      }

      setHours(Math.floor(diff / 3600));
      setMinutes(Math.floor((diff % 3600) / 60));
      setSeconds(diff % 60);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, endTime]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && endTime) {
        const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));

        setHours(Math.floor(diff / 3600));
        setMinutes(Math.floor((diff % 3600) / 60));
        setSeconds(diff % 60);
      }
    });

    return () => sub.remove();
  }, [endTime]);

  const startTimer = async () => {
    if (isRunning) return;

    const totalSeconds = getTotalSeconds();
    if (totalSeconds === 0) return;

    const end = Date.now() + totalSeconds * 1000;
    setEndTime(end);
    setIsRunning(true);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Timer Finished",
        body: "Your countdown has ended",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: totalSeconds,
      },
    });
  };

  const pauseTimer = async () => {
    setIsRunning(false);
    await stopAlarm();
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setEndTime(null);

    setHours(0);
    setMinutes(25);
    setSeconds(0);

    await stopAlarm();
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.timerView}>
        <IconButton
          icon="plus"
          iconColor="#FAFCFC"
          size={28}
          mode="contained"
          style={styles.timerIconButton}
          disabled={isRunning}
          onPress={() => {
            Vibration.vibrate(40);
            setMinutes((m) => {
              if (m === 59) {
                if (hours < 24) {
                  setHours((h) => h + 1);
                  return 0;
                }
                return 59;
              }
              return m + 1;
            });
          }}
        />

        <Text style={styles.timer}>
          {format(hours)}:{format(minutes)}:{format(seconds)}
        </Text>

        <IconButton
          icon="minus"
          iconColor="#FAFCFC"
          size={28}
          mode="contained"
          style={styles.timerIconButton}
          disabled={isRunning}
          onPress={() => {
            Vibration.vibrate(40);
            setMinutes((m) => {
              if (m === 0 && hours > 0) {
                setHours((h) => h - 1);
                return 59;
              }
              return Math.max(m - 1, 0);
            });
          }}
        />
      </View>

      <View style={styles.buttonView}>
        <Button
          textColor="#FAFCFC"
          style={styles.button}
          onPress={startTimer}
          disabled={isRunning}
          mode="contained"
        >
          Start
        </Button>

        <Button
          style={styles.button}
          onPress={pauseTimer}
          textColor="#FAFCFC"
          mode="contained"
        >
          Pause
        </Button>

        <Button
          style={styles.button}
          onPress={resetTimer}
          textColor="#FAFCFC"
          mode="contained"
        >
          Reset
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E0D1D",
  },
  timerView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  timer: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#FAFCFC",
  },
  timerIconButton: {
    borderRadius: 999,
    width: 50,
    height: 50,
    marginHorizontal: 20,
    backgroundColor: "#252533",
  },
  buttonView: {
    flexDirection: "row",
  },
  button: {
    margin: 12,
    backgroundColor: "#DB0138",
  },
});
