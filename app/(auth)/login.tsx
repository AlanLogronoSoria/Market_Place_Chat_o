import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const user = useAuthStore((s) => s.user);

  // ✅ LÓGICA ORIGINAL CONSERVADA
  useEffect(() => {
    if (user) {
      const normalizedRole = user.role?.toLowerCase().trim();

      if (normalizedRole === "vendedor") {
        router.replace("/");
      }
    }
  }, [user, router]);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) return;

    login({
      email: email.trim(),
      password,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#070B14", "#0F172A", "#111827"]}
        style={styles.container}
      >
        {/* Ambient Glow */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ======================== */}
          {/* HEADER */}
          {/* ======================== */}
          <View style={styles.header}>
            <LinearGradient
              colors={["#ef4444", "#991b1b"]}
              style={styles.logoContainer}
            >
              <Text style={styles.logoIcon}>✦</Text>
            </LinearGradient>

            <Text style={styles.brand}>ChatNova</Text>

          </View>

          {/* ======================== */}
          {/* LOGIN CARD */}
          {/* ======================== */}
          <BlurView
            intensity={40}
            tint="dark"
            style={styles.card}
          >
            {/* Decorative Glow */}
            <View style={styles.cardGlow} />

            {/* TITLES */}
            <View style={styles.titleWrapper}>

              <Text style={styles.titleDark}>
                Bienvenido
              </Text>

            </View>

            {/* ERROR */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}

            {/* FORM */}
            <View style={styles.form}>
              {/* EMAIL */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  EMAIL ADDRESS
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    focusedField === "email" &&
                      styles.inputFocused,
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() =>
                    setFocusedField("email")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                />
              </View>

              {/* PASSWORD */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>
                  PASSWORD
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    focusedField ===
                      "password" &&
                      styles.inputFocused,
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  onFocus={() =>
                    setFocusedField("password")
                  }
                  onBlur={() =>
                    setFocusedField(null)
                  }
                />
              </View>

              {/* LOGIN BUTTON */}
              <TouchableOpacity
                style={[
                  styles.btnPrimary,
                  isLoading &&
                    styles.btnDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[
                    "#ef4444",
                    "#dc2626",
                  ]}
                  style={styles.btnGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text
                      style={
                        styles.btnPrimaryText
                      }
                    >
                      Sign In
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* REGISTER BUTTON */}
              <Link
                href="/(auth)/register"
                asChild
              >
                <TouchableOpacity
                  style={styles.btnSecondary}
                  activeOpacity={0.85}
                >
                  <Text
                    style={
                      styles.btnSecondaryText
                    }
                  >
                    Create an account
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </BlurView>

          {/* FOOTER */}
          <View style={styles.footerContainer}>
            <View style={styles.footerDivider} />

            <Text style={styles.footer}>
              SECURE · PRIVATE · MODERN EXPERIENCE
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// ========================================
// 🎨 DESIGN SYSTEM
// ========================================

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#070B14",
  },

  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // ========================
  // AMBIENT LIGHTS
  // ========================

  glowTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor:
      "rgba(239,68,68,0.18)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor:
      "rgba(59,130,246,0.18)",
  },

  // ========================
  // HEADER
  // ========================

  header: {
    alignItems: "center",
    marginBottom: 34,
  },

  logoContainer: {
    width: 92,
    height: 92,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#ef4444",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },

    elevation: 12,
    marginBottom: 20,
  },

  logoIcon: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "800",
  },

  brand: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1.5,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },

  statusText: {
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },

  // ========================
  // CARD
  // ========================

  card: {
    borderRadius: 34,
    overflow: "hidden",
    padding: 28,

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",

    backgroundColor:
      "rgba(15,23,42,0.72)",

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 12,
    },

    elevation: 10,
  },

  cardGlow: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor:
      "rgba(239,68,68,0.08)",
  },

  titleWrapper: {
    marginBottom: 28,
  },

  titleLight: {
    fontSize: 46,
    fontWeight: "300",
    color: "#64748b",
    lineHeight: 48,
    letterSpacing: -2,
  },

  titleDark: {
    fontSize: 46,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 48,
    letterSpacing: -2,
    marginTop: -4,
  },

  subtitle: {
    fontSize: 15,
    color: "#94a3b8",
    marginTop: 10,
    lineHeight: 24,
  },

  // ========================
  // ERROR
  // ========================

  errorBox: {
    backgroundColor:
      "rgba(220,38,38,0.14)",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,

    borderWidth: 1,
    borderColor:
      "rgba(248,113,113,0.22)",
  },

  errorText: {
    color: "#fca5a5",
    fontSize: 13,
    fontWeight: "500",
  },

  // ========================
  // FORM
  // ========================

  form: {
    gap: 18,
  },

  fieldGroup: {
    gap: 8,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
    letterSpacing: 2,
    marginLeft: 4,
  },

  input: {
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",

    borderRadius: 20,

    paddingHorizontal: 18,
    paddingVertical: 16,

    fontSize: 15,
    color: "#fff",

    backgroundColor:
      "rgba(255,255,255,0.05)",
  },

  inputFocused: {
    borderColor:
      "rgba(239,68,68,0.45)",

    backgroundColor:
      "rgba(255,255,255,0.07)",

    shadowColor: "#ef4444",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 0,
    },

    elevation: 4,
  },

  // ========================
  // BUTTONS
  // ========================

  btnPrimary: {
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 10,
  },

  btnGradient: {
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  btnDisabled: {
    opacity: 0.6,
  },

  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.4,
  },

  btnSecondary: {
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",

    backgroundColor:
      "rgba(255,255,255,0.05)",

    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.08)",
  },

  btnSecondaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // ========================
  // FOOTER
  // ========================

  footerContainer: {
    alignItems: "center",
    marginTop: 34,
  },

  footerDivider: {
    width: 70,
    height: 4,
    borderRadius: 999,
    backgroundColor:
      "rgba(255,255,255,0.08)",
    marginBottom: 18,
  },

  footer: {
    textAlign: "center",
    fontSize: 11,
    color: "#64748b",
    letterSpacing: 2,
    fontWeight: "700",
  },
});