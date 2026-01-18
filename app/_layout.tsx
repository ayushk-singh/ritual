import { Authprovider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import * as React from "react";
import { Colors } from "@/constants/Colors";

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoadingUser } = useAuth();
  const router = useRouter();

  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";
    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/habit");
    }
  }, [user, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const paperTheme = {
    colors: Colors.dark,
  };

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaProvider>
          <Authprovider>
            <RouteGuard>
              <StatusBar style="dark" />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </RouteGuard>
          </Authprovider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
