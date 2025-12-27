import { useAuth } from "@/lib/auth-context";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button mode="text" onPress={signOut} icon={"logout"}>
        {" "}
        Sign Out{" "}
      </Button>
    </View>
  );
}
