import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DARK = "#202A36";
const GRAY_MID = "#6b7280";

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: DARK,
        headerTitleStyle: { fontWeight: "600", color: DARK },
        headerShadowVisible: false,
        headerBackTitle: "",
        contentStyle: { backgroundColor: "#f3f4f6" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Text style={styles.brand}>SkyChat</Text>
              <Text style={styles.tagline}>PRIVATE MESSAGING</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={logout}
              style={styles.logoutBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="chat/[roomId]"
        options={({ route }) => ({
          headerTitle: () => (
            <View style={styles.chatHeaderTitle}>
              <Text style={styles.chatTitle}>
                {(route.params as any)?.roomId ? "Channel" : "Chat"}
              </Text>
            </View>
          ),
        })}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: { alignItems: "center" },
  brand: {
    fontSize: 18,
    fontWeight: "600",
    color: DARK,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: 9,
    fontWeight: "600",
    color: GRAY_MID,
    letterSpacing: 2,
    marginTop: 1,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: "#f3f4f6",
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "500",
    color: DARK,
  },
  chatHeaderTitle: { alignItems: "center" },
  chatTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: DARK,
    letterSpacing: -0.3,
  },
});