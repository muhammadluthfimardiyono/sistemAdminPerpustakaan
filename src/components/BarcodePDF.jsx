import React from "react";
import { Page, Document, Image, StyleSheet } from "@react-pdf/renderer";
import JsBarcode from "jsbarcode";

const BarcodePDF = ({ barcodeData }) => {
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    barcodeImage: {
      width: "4cm",
      height: "3cm",
    },
  });
  let canvas;
  canvas = document.createElement("canvas");
  JsBarcode(canvas, barcodeData, { format: "CODE128" });
  const barcode = canvas.toDataURL();

  return (
    <Document>
      <Page
        size={{ width: "58mm", height: "65mm" }}
        orientation="landscape"
        style={styles.page}
      >
        <Image src={barcode} style={styles.barcodeImage} />
      </Page>
    </Document>
  );
};

export default BarcodePDF;
