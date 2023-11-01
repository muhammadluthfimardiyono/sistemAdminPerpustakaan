import { React, useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { Table, Button, Pagination, Dropdown, Badge } from "flowbite-react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Bar } from "react-chartjs-2";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataTransaksiPDF from "../components/DataTransaksiPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

const DataPeminjaman = () => {
  const [books, setBooks] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [monthlyTotals, setMonthlyTotals] = useState(Array(12).fill(0));
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const navigate = useNavigate();

  const data = {
    labels: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    datasets: [
      {
        label: "Data Peminjaman",
        data: monthlyTotals,
        fill: false,
        backgroundColor: "rgba(76, 29, 149, 0.2)",
        borderColor: "rgba(30, 58, 138, 1)",
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Data Jumlah Transaksi Peminjaman ${new Date().getFullYear()}`,
      },
    },
    animation: {
      duration: 1000, // animation duration in milliseconds
      easing: "easeOutQuad", // animation easing function
    },
  };

  const fetchPeminjaman = async () => {
    try {
      const response = await axios.get(
        "https://server.libraryselfservice.site/transaction"
      );
      const transactions = response.data;

      const userIds = transactions.map((transaction) => transaction.id_user);
      const usersResponse = await axios.get(
        `https://server.libraryselfservice.site/users?userIds=${userIds.join(
          ","
        )}`
      );
      const usersMap = usersResponse.data.reduce((map, user) => {
        map[user.id] = user.nama;
        return map;
      }, {});

      const booksData = transactions.map((transaction) => ({
        ...transaction,
        peminjam: usersMap[transaction.id_user],
      }));

      const monthlyData = Array(12).fill(0);

      booksData.forEach((book) => {
        const transactionDate = new Date(book.tanggal_pinjam);
        const transactionYear = transactionDate.getFullYear();
        const transactionMonth = transactionDate.getMonth();

        if (transactionYear === 2023) {
          monthlyData[transactionMonth] += 1;
        }
      });

      const sortedBooks = booksData.sort(
        (a, b) => b.id_transaksi - a.id_transaksi
      );
      setBooks(sortedBooks);
      setBooksData(sortedBooks);

      // setBooks(booksData);
      // setBooksData(booksData);
      setMonthlyTotals(monthlyData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  const totalPages = Math.ceil(books.length / perPage);

  const thisYear = new Date().getFullYear();

  return (
    <div>
      <SectionHeading title={"Data Peminjaman"}></SectionHeading>
      <div className="flex justify-center">
        <div className="w-3/4">
          <Bar data={data} options={options} />
        </div>
      </div>
      <div>
        <div className="mx-5 my-5">
          <div className="my-2">
            <hr
              style={{
                border: "0.5px solid #e2dddd",
              }}
            />
          </div>
          <div className="my-5 flex justify-between">
            <div>
              <h2 className="text-lg font-bold">Cetak Data Peminjaman</h2>
            </div>
            <div className="flex">
              <div className="mx-6">
                <Dropdown label="Bulan Peminjaman" size="sm">
                  <Dropdown.Item onClick={() => setSelectedMonth("Januari")}>
                    Januari
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Februari")}>
                    Februari
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Maret")}>
                    Maret
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("April")}>
                    April
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Mei")}>
                    Mei
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Juni")}>
                    Juni
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Juli")}>
                    Juli
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Agustus")}>
                    Agustus
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("September")}>
                    September
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Oktober")}>
                    Oktober
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("November")}>
                    November
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedMonth("Desember")}>
                    Desember
                  </Dropdown.Item>
                </Dropdown>
              </div>
              <div>
                <p className="text-lg">Data Bulan : {selectedMonth}</p>
              </div>
              <PDFDownloadLink
                className="mx-6"
                document={
                  <DataTransaksiPDF transaksi={books} bulan={selectedMonth} />
                }
                fileName={`Data Transaksi Peminjaman ${selectedMonth} ${thisYear}`}
              >
                {({ loading }) =>
                  loading ? (
                    <Button>Loading Document...</Button>
                  ) : (
                    <Button>Download</Button>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>
          <div className="my-2">
            <hr
              style={{
                border: "0.5px solid #e2dddd",
              }}
            />
          </div>
          <Table hoverable={true} className="table-fixed">
            <Table.Head>
              <Table.HeadCell>No.</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Peminjam</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Tanggal Pinjam</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Tenggat Pengembalian</Table.HeadCell>
              <Table.HeadCell>Jumlah Buku Dipinjam</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell colSpan={2} align="center">
                Action
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {books
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((book, index) => {
                  const rowIndex = (currentPage - 1) * perPage + index + 1;
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      <Table.Cell>{rowIndex}</Table.Cell>
                      <Table.Cell
                        colSpan={2}
                        className="font-medium text-gray-900 dark:text-white"
                      >
                        {book.peminjam}
                      </Table.Cell>
                      <Table.Cell colSpan={2}>
                        {new Date(book.tanggal_pinjam).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </Table.Cell>
                      <Table.Cell colSpan={2}>
                        {new Date(book.tenggat_kembali).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        {book.kode_barcode.split(",").length}
                      </Table.Cell>
                      <Table.Cell>
                        {book.status === "Selesai" ? (
                          <div className="w-fit">
                            <Badge
                              color={"success"}
                              size={"sm"}
                              className="text-center"
                            >
                              {book.status}
                            </Badge>
                          </div>
                        ) : (
                          <div className="w-fit">
                            <Badge
                              color={"warning"}
                              size={"sm"}
                              className="text-center"
                            >
                              {book.status}
                            </Badge>
                          </div>
                        )}
                      </Table.Cell>
                      <Table.Cell colSpan={2} align="center">
                        <Button
                          size={"xs"}
                          onClick={() => {
                            navigate(`/detail-transaksi/${book.id_transaksi}`);
                          }}
                        >
                          Detail
                        </Button>
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
            </Table.Body>
          </Table>

          <div className="flex justify-center my-5">
            <Pagination
              currentPage={currentPage}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              showIcons
              totalPages={totalPages}
            >
              {(page) => (
                <Pagination.Button
                  active={page === currentPage}
                  style={{
                    backgroundColor: page === currentPage ? "blue" : "white",
                    color: page === currentPage ? "white" : "blue",
                    fontWeight: page === currentPage ? "bold" : "normal",
                    border: page === currentPage ? "none" : "1px solid blue",
                  }}
                >
                  {page}
                </Pagination.Button>
              )}
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPeminjaman;
