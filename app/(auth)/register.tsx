import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  // NUEVO: Estado para cumplir con el requerimiento de roles
  const [role, setRole] = useState<'cliente' | 'vendedor'>('cliente');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const { register, isLoading, error } = useAuth();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.brand}>SkyChat</Text>
          <Text style={styles.tagline}>PRIVATE MESSAGING</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.titleLight}>Join</Text>
          <Text style={styles.titleDark}>SkyChat.</Text>
          <Text style={styles.subtitle}>Your dedication deserves recognition.</Text>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.form}>
            {/* NUEVO: Selector de Rol visual para el Deber 6 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>SELECCIONA TU ROL</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === 'cliente' && styles.roleBtnActive]} 
                  onPress={() => setRole('cliente')}
                >
                  <Text style={[styles.roleText, role === 'cliente' && styles.roleTextActive]}>Cliente</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.roleBtn, role === 'vendedor' && styles.roleBtnActive]} 
                  onPress={() => setRole('vendedor')}
                >
                  <Text style={[styles.roleText, role === 'vendedor' && styles.roleTextActive]}>Vendedor</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>USERNAME</Text>
              <TextInput
                style={[styles.input, focusedField === "username" && styles.inputFocused]}
                placeholder="no spaces"
                placeholderTextColor="#9ca3af"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={[styles.input, focusedField === "email" && styles.inputFocused]}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <TextInput
                style={[styles.input, focusedField === "password" && styles.inputFocused]}
                placeholder="min. 6 characters"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, isLoading && styles.btnDisabled]}
              // Enviamos el rol al hook
              onPress={() => register({ email, password, username, role })}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* CORREGIDO: Uso correcto de Link con asChild */}
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity style={styles.btnSecondary} activeOpacity={0.7}>
                <Text style={styles.btnSecondaryText}>Already have an account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// ESTILOS
// ==========================================
const DARK = "#202A36";
const GRAY_MID = "#6b7280";
const GRAY_LIGHT = "#f3f4f6";
const GRAY_300 = "#d1d5db";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GRAY_LIGHT },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 48 },
  header: { alignItems: "center", marginBottom: 36 },
  brand: { fontSize: 28, fontWeight: "600", color: DARK, letterSpacing: -0.5 },
  tagline: { fontSize: 11, fontWeight: "600", color: GRAY_MID, letterSpacing: 3, marginTop: 4 },
  card: { backgroundColor: "#fff", borderRadius: 24, padding: 32, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 6 },
  titleLight: { fontSize: 42, fontWeight: "400", color: "#9ca3af", letterSpacing: -1.5, lineHeight: 44 },
  titleDark: { fontSize: 42, fontWeight: "600", color: DARK, letterSpacing: -1.5, lineHeight: 44, marginTop: -6 },
  subtitle: { fontSize: 15, color: GRAY_MID, marginTop: 8, marginBottom: 28 },
  errorBox: { backgroundColor: "#fef2f2", borderRadius: 10, padding: 12, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: "#ef4444" },
  errorText: { color: "#dc2626", fontSize: 13 },
  form: { gap: 16 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: "600", color: GRAY_MID, letterSpacing: 2 },
  
  // Estilos del selector de roles
  roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  roleBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: GRAY_300, alignItems: 'center' },
  roleBtnActive: { borderColor: DARK, backgroundColor: DARK },
  roleText: { color: GRAY_MID, fontWeight: '600' },
  roleTextActive: { color: '#fff' },

  input: { borderWidth: 1.5, borderColor: GRAY_300, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: DARK, backgroundColor: "#fafafa" },
  inputFocused: { borderColor: DARK, backgroundColor: "#fff" },
  btnPrimary: { backgroundColor: DARK, borderRadius: 100, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: "#fff", fontWeight: "600", fontSize: 15 },
  btnSecondary: { borderRadius: 100, paddingVertical: 14, alignItems: "center", backgroundColor: GRAY_300 },
  btnSecondaryText: { color: "#374151", fontWeight: "500", fontSize: 15 },
});