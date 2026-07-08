import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Link as PDFLink,
} from "@react-pdf/renderer";
import { Property } from "@/data/properties";
import { SiteConfig } from "@/config/siteConfig";
import { formatPrice } from "@/utils/formatPrice";

interface PropertyPDFProps {
  property: Property;
  siteConfig: SiteConfig;
  propertyUrl: string;
  /** Absolute image URLs (so the renderer can fetch them). */
  images: string[];
  generatedAt: string;
}

const PALETTE = {
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  surface: "#f9fafb",
};

function buildStyles(primary: string) {
  return StyleSheet.create({
    page: {
      paddingTop: 32,
      paddingBottom: 48,
      paddingHorizontal: 36,
      fontSize: 10,
      color: PALETTE.text,
      fontFamily: "Helvetica",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: PALETTE.border,
    },
    siteName: {
      fontSize: 14,
      fontWeight: 700,
      color: primary,
    },
    brokerInfo: {
      textAlign: "right",
      fontSize: 9,
      color: PALETTE.muted,
      lineHeight: 1.5,
    },
    titleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: 700,
      flex: 1,
      paddingRight: 12,
    },
    badge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      fontSize: 9,
      fontWeight: 700,
      color: "#ffffff",
    },
    badgeVenta: { backgroundColor: "#10b981" },
    badgeRenta: { backgroundColor: "#3b82f6" },
    location: {
      fontSize: 10,
      color: PALETTE.muted,
      marginBottom: 14,
    },
    heroImage: {
      width: "100%",
      height: 220,
      borderRadius: 4,
      objectFit: "cover",
      marginBottom: 14,
    },
    priceBox: {
      backgroundColor: PALETTE.surface,
      borderLeftWidth: 4,
      borderLeftColor: primary,
      padding: 12,
      marginBottom: 16,
    },
    priceLabel: {
      fontSize: 9,
      color: PALETTE.muted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    priceValue: {
      fontSize: 20,
      fontWeight: 700,
      color: primary,
    },
    features: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 18,
    },
    feature: {
      flex: 1,
      backgroundColor: PALETTE.surface,
      padding: 10,
      borderRadius: 4,
      alignItems: "center",
    },
    featureLabel: {
      fontSize: 8,
      color: PALETTE.muted,
      marginBottom: 3,
      textTransform: "uppercase",
    },
    featureValue: {
      fontSize: 13,
      fontWeight: 700,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 700,
      marginBottom: 6,
      marginTop: 4,
    },
    paragraph: {
      fontSize: 10,
      lineHeight: 1.55,
      color: PALETTE.text,
      marginBottom: 14,
    },
    techGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      borderTopWidth: 1,
      borderTopColor: PALETTE.border,
      marginBottom: 16,
    },
    techCell: {
      width: "33.33%",
      paddingVertical: 8,
      paddingRight: 8,
      borderBottomWidth: 1,
      borderBottomColor: PALETTE.border,
    },
    techLabel: {
      fontSize: 8,
      color: PALETTE.muted,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    techValue: {
      fontSize: 10,
      fontWeight: 600,
    },
    thumbnailsRow: {
      flexDirection: "row",
      gap: 6,
      marginBottom: 18,
    },
    thumbnail: {
      width: "23.5%",
      height: 70,
      borderRadius: 3,
      objectFit: "cover",
    },
    footer: {
      position: "absolute",
      bottom: 24,
      left: 36,
      right: 36,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: PALETTE.border,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      fontSize: 8,
      color: PALETTE.muted,
    },
    link: {
      color: primary,
      textDecoration: "none",
    },
  });
}

export default function PropertyPDF({
  property,
  siteConfig,
  propertyUrl,
  images,
  generatedAt,
}: PropertyPDFProps) {
  const styles = buildStyles(siteConfig.primaryColor);
  const heroImage = images[0];
  const thumbnails = images.slice(1, 5); // up to 4 extra thumbnails

  return (
    <Document
      title={`${property.title} — ${siteConfig.siteName}`}
      author={siteConfig.brokerName}
      subject={`Ficha de propiedad: ${property.title}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header} fixed>
          <Text style={styles.siteName}>{siteConfig.siteName}</Text>
          <View style={styles.brokerInfo}>
            <Text>{siteConfig.brokerName}</Text>
            <Text>{siteConfig.phone}</Text>
            <Text>{siteConfig.email}</Text>
          </View>
        </View>

        {/* Title + badge */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{property.title}</Text>
          <Text
            style={[
              styles.badge,
              property.type === "venta" ? styles.badgeVenta : styles.badgeRenta,
            ]}
          >
            {property.type === "venta" ? "VENTA" : "RENTA"}
          </Text>
        </View>
        <Text style={styles.location}>
          {property.location}, {property.city}
        </Text>

        {/* Hero image */}
        {heroImage && <Image src={heroImage} style={styles.heroImage} />}

        {/* Price */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Precio</Text>
          <Text style={styles.priceValue}>
            {formatPrice(property.price, property.currency)}
          </Text>
        </View>

        {/* Features grid */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureLabel}>Recámaras</Text>
            <Text style={styles.featureValue}>{property.bedrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureLabel}>Baños</Text>
            <Text style={styles.featureValue}>{property.bathrooms}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureLabel}>Estacionamientos</Text>
            <Text style={styles.featureValue}>{property.parking}</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureLabel}>Área</Text>
            <Text style={styles.featureValue}>{property.area} m²</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.paragraph}>{property.description}</Text>

        {/* Spec sheet */}
        <Text style={styles.sectionTitle}>Ficha técnica</Text>
        <View style={styles.techGrid}>
          <View style={styles.techCell}>
            <Text style={styles.techLabel}>Tipo</Text>
            <Text style={styles.techValue}>
              {property.type === "venta" ? "Venta" : "Renta"}
            </Text>
          </View>
          <View style={styles.techCell}>
            <Text style={styles.techLabel}>Recámaras</Text>
            <Text style={styles.techValue}>{property.bedrooms}</Text>
          </View>
          <View style={styles.techCell}>
            <Text style={styles.techLabel}>Baños</Text>
            <Text style={styles.techValue}>{property.bathrooms}</Text>
          </View>
          <View style={styles.techCell}>
            <Text style={styles.techLabel}>Estacionamientos</Text>
            <Text style={styles.techValue}>{property.parking}</Text>
          </View>
          <View style={styles.techCell}>
            <Text style={styles.techLabel}>Área</Text>
            <Text style={styles.techValue}>{property.area} m²</Text>
          </View>
          <View style={styles.techCell}>
            <Text style={styles.techLabel}>Ubicación</Text>
            <Text style={styles.techValue}>{property.location}</Text>
          </View>
        </View>

        {/* Additional gallery */}
        {thumbnails.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Más fotos</Text>
            <View style={styles.thumbnailsRow}>
              {thumbnails.map((src, i) => (
                <Image key={i} src={src} style={styles.thumbnail} />
              ))}
            </View>
          </>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View>
            <Text>{siteConfig.siteName} — {siteConfig.brokerName}</Text>
            <Text>
              Ver online:{" "}
              <PDFLink src={propertyUrl} style={styles.link}>
                {propertyUrl}
              </PDFLink>
            </Text>
          </View>
          <Text>Generado el {generatedAt}</Text>
        </View>
      </Page>
    </Document>
  );
}
