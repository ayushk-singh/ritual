import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="habit"
        options={{
          title: "Habits",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="fire" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: "Todo",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-blank-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pomodoro"
        options={{
          title: "Pomodoro",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-check-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
