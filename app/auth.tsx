import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, View, StyleSheet } from "react-native";
import { TextInput, Text, Button, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>("")

  const theme = useTheme()
  const router = useRouter()

  const { signIn, signUp } = useAuth()

  const handleAuth = async() => {
    if(!email || !password) {
      setError("Please fill in all fields.")
      return
    }

    if(password.length < 6){
      setError("Password must be at least 6 character long")
      return
    }

    setError(null)

    if(isSignUp) {
      await signUp(email, password)
      if (error) {
        setError(error)
        return
      }
    }else {
      const error = await signIn(email,password)
      if (error) {
        setError(error)
        return
      }

      router.replace('/')
    }

  }

  const handleSwithcMode = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.container}
    >
      <View style={style.content}>
        <Text variant="headlineMedium" style={style.title}>
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>

        <TextInput
          style={style.input}
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="example@gmail.com"
          mode="outlined"
          onChangeText={setEmail}
        />

        <TextInput
          style={style.input}
          label="Password"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" onPress={handleAuth} style={style.button}>{isSignUp ? "Sign Up" : "Sign In"}</Button>
        <Button mode="text" style={style.switchModeButton} onPress={handleSwithcMode}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16
  }
});
