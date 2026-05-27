import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useProducts } from "../hooks/useProducts";

// Constantes estéticas alineadas a SkyChat
const DARK = "#202A36";
const GRAY_MID = "#6b7280";
const GRAY_LIGHT = "#f3f4f6";
const GRAY_300 = "#d1d5db";
const SUCCESS = "#10b981";

export function MarketplaceView() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { products, isLoading, createProduct, isCreating } = useProducts();
  const { createRoom } = useRooms(); // Hook para inicializar chats desde el cliente

  // Estados locales para el formulario de creación
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const isVendedor = user?.role?.toLowerCase().trim() === "vendedor";

  // Manejador para publicar el producto (Vendedor)
  const handlePublish = async () => {
    setFormError(null);
    if (!name.trim() || !price.trim()) {
      setFormError("El nombre y el precio son obligatorios.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Ingresa un precio numérico válido y mayor a 0.");
      return;
    }

    try {
      await createProduct({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
      });
      
      // Limpiar formulario tras éxito
      setName("");
      setDescription("");
      setPrice("");
    } catch (err: any) {
      setFormError(err?.message || "No se pudo crear el producto.");
    }
  };

  // Manejador para iniciar chat sobre un producto (Cliente)
  const handleContactSeller = async (productId: string, productName: string) => {
    try {
      // Crea o recupera la sala en Supabase pasándole el producto consultado
      const room = await createRoom({ productId, productName });
      if (room?.id) {
        router.push(`/chat/${room.id}`);
      }
    } catch (err) {
      console.error("Error al abrir chat de negociación:", err);
    }
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <View style={styles.productMain}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.productDescription}>{item.description}</Text>
          ) : null}
        </View>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>

      {/* Si el usuario ingresó como CLIENTE, puede simular preguntas */}
      {!isVendedor && (
        <TouchableOpacity
          style={styles.btnContact}
          onPress={() => handleContactSeller(item.id, item.name)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnContactText}>Preguntar por este producto</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={DARK} />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER EXCLUSIVO PARA EL FORMULARIO DEL VENDEDOR */}
      {isVendedor && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>AÑADIR NUEVO PRODUCTO</Text>
          
          {formError && <Text style={styles.errorText}>{formError}</Text>}

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto (ej: Laptop Asus)"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción breve"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio ($)"
              placeholderTextColor="#9ca3af"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.btnSubmit, isCreating && styles.btnDisabled]}
              onPress={handlePublish}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnSubmitText}>Publicar en Marketplace</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SUBHEADER DEL CATÁLOGO */}
      <View style={styles.subheader}>
        <Text style={styles.subheaderLabel}>CATÁLOGO DE PRODUCTOS</Text>
        <Text style={styles.subheaderCount}>{products.length}</Text>
      </View>

      {/* LISTADO DE PRODUCTOS */}
      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        renderItem={renderProduct}
        contentContainerStyle={products.length === 0 ? { flex: 1 } : { paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Marketplace Vacío</Text>
            <Text style={styles.emptySubtitle}>
              No hay productos registrados en este momento.
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GRAY_LIGHT },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  loadingText: { color: GRAY_MID, fontSize: 14 },
  
  // Estilos del Subheader
  subheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: GRAY_300,
  },
  subheaderLabel: { fontSize: 10, fontWeight: "600", color: GRAY_MID, letterSpacing: 2 },
  subheaderCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    backgroundColor: DARK,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    overflow: "hidden",
  },

  // Estilos Formulario Creación
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: GRAY_300,
  },
  formTitle: { fontSize: 11, fontWeight: "700", color: DARK, letterSpacing: 1.5, marginBottom: 12 },
  form: { gap: 10 },
  input: {
    borderWidth: 1.5,
    borderColor: GRAY_300,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: DARK,
    backgroundColor: "#fafafa",
  },
  btnSubmit: {
    backgroundColor: SUCCESS,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnSubmitText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  errorText: { color: "#dc2626", fontSize: 12, marginBottom: 8, fontWeight: "500" },

  // Estilos de las Tarjetas de Producto
  productCard: {
    backgroundColor: "#fff",
    padding: 20,
    gap: 12,
  },
  productMain: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  productInfo: { flex: 1, paddingRight: 16 },
  productName: { fontSize: 16, fontWeight: "600", color: DARK },
  productDescription: { fontSize: 13, color: GRAY_MID, marginTop: 4, lineHeight: 18 },
  productPrice: { fontSize: 18, fontWeight: "700", color: DARK },
  
  // Botón para que el Cliente pregunte
  btnContact: {
    borderWidth: 1.5,
    borderColor: DARK,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnContactText: { color: DARK, fontWeight: "600", fontSize: 13 },
  
  separator: { height: 8, backgroundColor: GRAY_LIGHT },
  
  // Lista Vacía
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: DARK },
  emptySubtitle: { fontSize: 13, color: GRAY_MID, textAlign: "center", paddingHorizontal: 40 },
});