import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// ==========================================
// SKYCHAT "BEAUTIFUL RED" DESIGN SYSTEM
// ==========================================
const COLORS = {
  dark: "#202A36",
  redPrimary: "#ef4444",   // Rojo vibrante y moderno
  redDark: "#dc2626",      // Rojo profundo para gradientes
  redSoft: "#fef2f2",      // Blanco con un tinte súper sutil de rojo para el fondo
  redBorder: "#fca5a5",    // Bordes rojizos suaves
  grayMid: "#6b7280",
  white: "#ffffff",
  success: "#22c55e",      // Verde para confirmar seguridad
};

export default function AppLayout() {
  const { logout } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.redPrimary,
        headerTitleStyle: {
          fontWeight: "700",
          color: COLORS.redPrimary,
        },
        headerShadowVisible: false,
        headerBackTitle: "",
        contentStyle: {
          backgroundColor: COLORS.redSoft, // Fondo cálido
        },
        headerTitleAlign: "center",
        headerBackVisible: true,
      }}
    >
      {/* ===================================== */}
      {/* MARKETPLACE / HOME */}
      {/* ===================================== */}
      
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Text style={styles.brand}>ChatNova</Text>

              {/* Fila de estado combinada */}
              <View style={styles.statusRow}>
                <ShieldCheck size={11} color={COLORS.success} />
                <Text style={styles.tagline}>PRIVATE MESSAGING</Text>
              </View>
            </View>
          ),

          headerRight: () => (
            <TouchableOpacity
              onPress={logout}
              style={styles.logoutWrapper}
              activeOpacity={0.85}
            >
              {/* Botón con degradado rojo */}
              <LinearGradient
                colors={[COLORS.redPrimary, COLORS.redDark]}
                style={styles.logoutBtn}
              >
                <Text style={styles.logoutText}>Sign out</Text>
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />

      {/* ===================================== */}
      {/* CHAT SCREEN */}
      {/* ===================================== */}
      <Stack.Screen
        name="chat/[roomId]"
        options={({ route }) => ({
          headerTransparent: true,

          headerTitle: () => (
            <BlurView intensity={80} tint="light" style={styles.chatHeader}>
              <Text style={styles.chatTitle}>
                {(route.params as any)?.roomId ? "Secure Chat" : "Chat"}
              </Text>

              {/* Fila de estado segura */}
              <View style={styles.statusRow}>
                <ShieldCheck size={11} color={COLORS.success} />
                <Text style={styles.chatSubtitle}>
                  ENCRYPTED CONNECTION ACTIVE
                </Text>
              </View>
            </BlurView>
          ),
          

          // Botón derecho vacío para mantener centrado
          headerRight: () => <View style={{ width: 88 }} />,
        })}
      />
    </Stack>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  // ======================================
  // HEADER PRINCIPAL
  // ======================================
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.redPrimary, // Texto de la marca en rojo
    letterSpacing: -0.8,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },

  tagline: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.grayMid,
    letterSpacing: 2.8,
  },

  // ======================================
  // BOTÓN LOGOUT (Rojo Degradado)
  // ======================================
  logoutWrapper: {
    borderRadius: 100,
    shadowColor: COLORS.redPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  logoutBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.2,
  },

  // ======================================
  // HEADER CHAT (BlurView adaptado)
  // ======================================
  chatHeader: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 18,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: COLORS.redBorder, // Borde con un toque rojo

    backgroundColor: "rgba(255, 255, 255, 0.8)",

    alignItems: "center",
    justifyContent: "center",
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.redPrimary, // Título del chat en rojo
    letterSpacing: -0.5,
  },

  chatSubtitle: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.grayMid,
    letterSpacing: 2.4,
  },
});