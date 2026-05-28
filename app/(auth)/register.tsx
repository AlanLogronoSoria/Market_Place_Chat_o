import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import {
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Store,
  User,
} from "lucide-react-native";
import { useMemo, useState } from "react";
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

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"cliente" | "vendedor">("cliente");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { register, isLoading, error } = useAuth();

  const roleDescription = useMemo(() => {
    return role === "cliente"
      ? "Discover products and connect instantly."
      : "Sell smarter with real-time conversations.";
  }, [role]);

  return (
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#070B14", "#0F172A", "#111827"]}
        style={styles.root}
      >
        {/* Ambient Glows */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* HERO */}
            <View style={styles.hero}>
              <View style={styles.logoWrapper}>
                <LinearGradient
                  colors={["#ef4444", "#dc2626", "#991b1b"]}
                  style={styles.logoGradient}
                >
                  <Sparkles color="#fff" size={20} />
                </LinearGradient>
              </View>

              <Text style={styles.brand}>ChatNova</Text>

              <Text style={styles.tagline}>
                NEXT GENERATION MARKETPLACE
              </Text>
            </View>

            {/* CARD */}
            <BlurView intensity={35} tint="dark" style={styles.card}>
              <View style={styles.cardBorder} />

              <Text style={styles.titleMuted}>Crea</Text>
              <Text style={styles.title}>tu cuenta.</Text>

              <Text style={styles.subtitle}>{roleDescription}</Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* ROLE SELECTOR */}
              <View style={styles.section}>
                <Text style={styles.label}>SELECCIONA TU TIPO DE CUENTA</Text>

                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.roleCard,
                      role === "cliente" && styles.roleCardActive,
                    ]}
                    onPress={() => setRole("cliente")}
                  >
                    <View
                      style={[
                        styles.roleIcon,
                        role === "cliente" && styles.roleIconActive,
                      ]}
                    >
                      <User
                        size={18}
                        color={role === "cliente" ? "#ffffff" : "#9ca3af"}
                      />
                    </View>

                    <Text
                      style={[
                        styles.roleTitle,
                        role === "cliente" && styles.roleTitleActive,
                      ]}
                    >
                      Cliente
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Compra y Chatea en tiempo real
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.roleCard,
                      role === "vendedor" && styles.roleCardActiveRed,
                    ]}
                    onPress={() => setRole("vendedor")}
                  >
                    <View
                      style={[
                        styles.roleIcon,
                        role === "vendedor" && styles.roleIconActiveRed,
                      ]}
                    >
                      <Store
                        size={18}
                        color={role === "vendedor" ? "#ffffff" : "#9ca3af"}
                      />
                    </View>

                    <Text
                      style={[
                        styles.roleTitle,
                        role === "vendedor" && styles.roleTitleActive,
                      ]}
                    >
                      Vendedor
                    </Text>

                    <Text style={styles.roleSubtitle}>
                      Maneja tu Marketplace
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* FORM */}
              <View style={styles.form}>
                {/* USERNAME */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>USERNAME</Text>

                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "username" &&
                        styles.inputWrapperFocused,
                    ]}
                  >
                    <User size={18} color="#9ca3af" />

                    <TextInput
                      style={styles.input}
                      placeholder="your_username"
                      placeholderTextColor="#6b7280"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      onFocus={() => setFocusedField("username")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* EMAIL */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>EMAIL ADDRESS</Text>

                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "email" &&
                        styles.inputWrapperFocused,
                    ]}
                  >
                    <Mail size={18} color="#9ca3af" />

                    <TextInput
                      style={styles.input}
                      placeholder="you@example.com"
                      placeholderTextColor="#6b7280"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* PASSWORD */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>PASSWORD</Text>

                  <View
                    style={[
                      styles.inputWrapper,
                      focusedField === "password" &&
                        styles.inputWrapperFocused,
                    ]}
                  >
                    <Lock size={18} color="#9ca3af" />

                    <TextInput
                      style={styles.input}
                      placeholder="Minimum 6 characters"
                      placeholderTextColor="#6b7280"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </View>

                {/* SECURITY INFO */}
                <View style={styles.securityBox}>
                  <ShieldCheck size={16} color="#22c55e" />

                  <Text style={styles.securityText}>
                    Encrypted authentication and secure access.
                  </Text>
                </View>

                {/* REGISTER BUTTON */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.primaryButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={() =>
                    register({
                      email: email.trim(),
                      password,
                      username: username.trim(),
                      role,
                    })
                  }
                  disabled={isLoading}
                >
                  <LinearGradient
                    colors={
                      role === "vendedor"
                        ? ["#ef4444", "#dc2626", "#991b1b"]
                        : ["#2563eb", "#1d4ed8", "#1e3a8a"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.primaryGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.primaryButtonText}>
                          Create Account
                        </Text>

                        <ArrowRight color="#fff" size={18} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* LOGIN BUTTON */}
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>
                      Already have an account
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </BlurView>

            <Text style={styles.footer}>
              SECURE · REALTIME · MARKETPLACE
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#070B14",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 60,
  },

  glowTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(239,68,68,0.18)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -100,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: "rgba(37,99,235,0.18)",
  },

  hero: {
    alignItems: "center",
    marginBottom: 28,
  },

  logoWrapper: {
    marginBottom: 16,
  },

  logoGradient: {
    width: 62,
    height: 62,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  brand: {
    fontSize: 34,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -1,
  },

  tagline: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
    color: "#6b7280",
  },

  card: {
    overflow: "hidden",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(15,23,42,0.72)",
    padding: 28,
  },

  cardBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  titleMuted: {
    fontSize: 44,
    color: "#6b7280",
    fontWeight: "300",
    letterSpacing: -2,
    lineHeight: 46,
  },

  title: {
    fontSize: 44,
    color: "#ffffff",
    fontWeight: "800",
    letterSpacing: -2,
    lineHeight: 46,
    marginTop: -4,
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    marginTop: 12,
    marginBottom: 28,
    lineHeight: 24,
  },

  errorBox: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },

  errorText: {
    color: "#fca5a5",
    fontSize: 13,
  },

  section: {
    marginBottom: 24,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#94a3b8",
    marginBottom: 12,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 14,
  },

  roleCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },

  roleCardActive: {
    borderColor: "rgba(59,130,246,0.55)",
    backgroundColor: "rgba(37,99,235,0.12)",
  },

  roleCardActiveRed: {
    borderColor: "rgba(239,68,68,0.55)",
    backgroundColor: "rgba(239,68,68,0.12)",
  },

  roleIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  roleIconActive: {
    backgroundColor: "#2563eb",
  },

  roleIconActiveRed: {
    backgroundColor: "#dc2626",
  },

  roleTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  roleTitleActive: {
    color: "#ffffff",
  },

  roleSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },

  form: {
    gap: 18,
  },

  fieldGroup: {
    gap: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },

  inputWrapperFocused: {
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  input: {
    flex: 1,
    color: "#ffffff",
    paddingVertical: 16,
    fontSize: 15,
  },

  securityBox: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(34,197,94,0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.15)",
    padding: 14,
  },

  securityText: {
    color: "#bbf7d0",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },

  primaryButton: {
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
  },

  primaryGradient: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  secondaryButton: {
    marginTop: 2,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  secondaryButtonText: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: 14,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  footer: {
    textAlign: "center",
    marginTop: 28,
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
  },
});