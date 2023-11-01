import React, { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import BackButton from "../components/BackButton";
import { Table } from "flowbite-react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DetailTransaksi() {
  const [transactionData, setTransactionData] = useState({});
  const [books, setBooks] = useState([]);
  const { id } = useParams();

  const fetchTransactionData = async (id) => {
    axios
      .get(`https://server.libraryselfservice.site/fetch-transaction/${id}`)
      .then(async (response) => {
        setTransactionData(response.data);
        const barcodePromises = response.data.kode_barcode
          .split(",")
          .map(async (barcode) => {
            const bookResponse = await axios.get(
              `https://server.libraryselfservice.site/data-buku/${barcode}`
            );
            if (
              bookResponse &&
              bookResponse.data &&
              bookResponse.data.length > 0
            ) {
              return bookResponse.data[0];
            }
            return null;
          });

        const bookData = await Promise.all(barcodePromises);
        setBooks(bookData);
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    fetchTransactionData(id);
  }, []);

  return (
    <div>
      <div className="mx-5 my-5">
        <SectionHeading title={"Detail Transaksi"}></SectionHeading>
        <div>
          <div>
            <BackButton></BackButton>
          </div>
          <div className="mx-5 my-5">
            <div className="my-5 grid grid-cols-1 gap-2">
              <p>
                <b>ID Transaksi :</b> {transactionData.id_transaksi}
              </p>
              <p>
                <b>ID Peminjam :</b> {transactionData.id_user}
              </p>
              <p>
                <b>Tanggal Pinjam :</b>{" "}
                {new Date(transactionData.tanggal_pinjam).toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
              <p>
                {" "}
                <b>Tenggat Pengembalian :</b>{" "}
                {new Date(transactionData.tenggat_kembali).toLocaleDateString(
                  "id-ID",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>
            <hr
              style={{
                border: "0.5px solid #e2dddd",
              }}
            />
            <div>
              <h3 className="text-xl text-center my-3 font-bold">
                Buku yang Dipinjam
              </h3>
            </div>
            <Table hoverable={true} className="w-full">
              <Table.Head>
                <Table.HeadCell>No.</Table.HeadCell>
                <Table.HeadCell>Pengarang</Table.HeadCell>
                <Table.HeadCell>Judul</Table.HeadCell>
                <Table.HeadCell>Penerbit</Table.HeadCell>
                <Table.HeadCell>Tahun Terbit</Table.HeadCell>
                <Table.HeadCell>Kode Buku</Table.HeadCell>
                {/* <Table.HeadCell>Action</Table.HeadCell> */}
              </Table.Head>
              <Table.Body className="divide-y">
                {books.map((book, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={book.kode_barcode}
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {index + 1}
                    </Table.Cell>
                    <Table.Cell>{book.pengarang}</Table.Cell>
                    <Table.Cell>{book.judul}</Table.Cell>
                    <Table.Cell>{book.penerbit}</Table.Cell>
                    <Table.Cell>{book.tahun_terbit}</Table.Cell>
                    <Table.Cell>{book.kode_barcode}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailTransaksi;
