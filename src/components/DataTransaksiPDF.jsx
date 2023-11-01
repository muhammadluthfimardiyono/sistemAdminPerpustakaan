import { Page, Text, Document, StyleSheet, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    marginBottom: 12,
    fontSize: 10,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    color: "grey",
  },
  tableContainer: {
    flexDirection: "row",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    alignItems: "center",
    height: 24,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    color: "#000",
    fontWeight: "bold",
    fontSize: 10,
  },
  tableCell: {
    flex: 3,
    textAlign: "center",
    fontSize: 10,
    marginHorizontal: 5,
  },
  noColumn: {
    flex: 1,
  },
});

function DataTransaksiPDF({ transaksi, bulan }) {
  const filteredTransaksi = transaksi.filter((transaksi) => {
    const transactionDate = new Date(transaksi.tanggal_pinjam);
    const transactionMonth = transactionDate
      .toLocaleDateString("id-ID", {
        month: "long",
      })
      .toLowerCase();
    return transactionMonth === bulan.toLowerCase();
  });

  const thisYear = new Date().getFullYear;
  return (
    <Document>
      <Page style={styles.body} size={"A4"} orientation="landscape">
        <Text style={styles.title} fixed>
          Data Transaksi
        </Text>
        <Text style={styles.subTitle} fixed>
          Bulan {bulan} {thisYear}
        </Text>

        <View style={styles.tableContainer}>
          <View style={styles.section}>
            <View style={styles.table}>
              {/* Table header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, styles.noColumn]}>
                  <Text>No.</Text>
                </View>
                <View style={[styles.tableCell, styles.noColumn]}>
                  <Text>ID</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Peminjam</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Tanggal Pinjam</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Tenggat Pengembalian</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Tanggal Kembali</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>Kode Buku</Text>
                </View>
              </View>

              {/* Table rows */}
              {filteredTransaksi.map((t, index) => (
                <View key={index} style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.noColumn]}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.noColumn]}>
                    <Text>{t.id_transaksi}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{t.peminjam}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>
                      {new Date(t.tanggal_pinjam).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>
                      {new Date(t.tenggat_kembali).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>
                      {t.tanggal_kembali === null
                        ? "Belum dikembalikan"
                        : new Date(t.tanggal_kembali).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                    </Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{t.kode_barcode}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default DataTransaksiPDF;
