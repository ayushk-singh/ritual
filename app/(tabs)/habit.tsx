import { useAuth } from "@/lib/auth-context";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Habit() {
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon={() => (
          <MaterialCommunityIcons name="plus" size={22} color="white" />
        )}
        style={styles.habitButton}
        contentStyle={styles.habitButtonContent}
      >
        Add Habit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  habitButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 25,
    elevation: 4,
  },

  habitButtonContent: {
    height: 52,
    paddingHorizontal: 16,
  },
});
