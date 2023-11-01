import React, { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { Table, Pagination, Button, Modal } from "flowbite-react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import PopUp from "../components/PopUp";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Finedetails = () => {
  const [transaksi, setTransaksi] = useState([]);
  const [buku, setBuku] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [MendekatiDenda, setMendekatiDenda] = useState([]);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionData, setActionData] = useState({});

  const navigate = useNavigate();

  const fetchTransaksiBuku = async () => {
    try {
      const response = await axios.get(
        "https://server.libraryselfservice.site/transaction"
      );
      const transactions = response.data;

      const filteredData = transactions.filter((item) => {
        const tenggatKembaliDate = new Date(item.tenggat_kembali);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tenggatKembaliDate.setHours(0, 0, 0, 0);
        return tenggatKembaliDate < today && item.status === "Dipinjam";
      });

      const transaksiDendaResponse = await axios.get(
        "https://server.libraryselfservice.site/buku-dipinjam"
      );
      const transaksiDenda = transaksiDendaResponse.data.filter((item) => {
        return item.hilang === 1;
      });

      const combinedData = [
        ...new Set([
          ...filteredData.map((transaction) => transaction.id_transaksi),
          ...transaksiDenda.map((transaksi) => transaksi.id_transaksi),
        ]),
      ];

      const combinedDataResponse = [];

      for (const transactionID of combinedData) {
        const fetchResponse = await axios.get(
          `https://server.libraryselfservice.site/fetch-transaction/${transactionID}`
        );
        const fetchedData = fetchResponse.data;
        combinedDataResponse.push(fetchedData);
      }

      const userIds = combinedDataResponse.map(
        (transaction) => transaction.id_user
      );
      const usersResponse = await axios.get(
        `https://server.libraryselfservice.site/users?userIds=${userIds.join(
          ","
        )}`
      );
      const usersMap = usersResponse.data.reduce((map, user) => {
        map[user.id] = {
          nama: user.nama,
          email: user.email, // Include the email field
        };
        return map;
      }, {});

      const transactionData = combinedDataResponse.map((transaction) => ({
        ...transaction,
        peminjam: usersMap[transaction.id_user],
      }));

      const separatedKodeBarcodeArray = [
        ...new Set(
          transactionData
            .map((transaction) => transaction.kode_barcode)
            .flatMap((kodeBarcode) => kodeBarcode.split(","))
        ),
      ];

      const dataBuku = [];

      for (const buku of separatedKodeBarcodeArray) {
        const bukuResponse = await axios.get(
          `https://server.libraryselfservice.site/data-buku/${buku}`
        );
        const bukuData = bukuResponse.data;

        dataBuku.push(bukuData);
      }

      const filteredTransactionData = transactionData.filter((item) => {
        return item.status === "Dipinjam";
      });

      const sortedBooks = filteredTransactionData.sort(
        (a, b) => b.id_transaksi - a.id_transaksi
      );
      // setBooks(sortedBooks);
      // setBooksData(sortedBooks);
      setTransaksi(sortedBooks);
      // console.log(dataBuku);
      // setBuku(BukuData);
    } catch (error) {
      console.error("Error fetching books and transaction:", error);
    }
  };

  const fetchTransaksiMedekatiDenda = async () => {
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
        map[user.id] = {
          nama: user.nama,
          email: user.email, // Include the email field
        };
        return map;
      }, {});

      const transactionData = transactions.map((transaction) => ({
        ...transaction,
        peminjam: usersMap[transaction.id_user],
      }));

      const filteredData = transactionData.filter((item) => {
        const tenggatKembaliDate = new Date(item.tenggat_kembali);
        const today = new Date();

        const twoDaysAfterToday = new Date(
          today.getTime() + 2 * 24 * 60 * 60 * 1000
        );

        today.setHours(0, 0, 0, 0);
        twoDaysAfterToday.setHours(0, 0, 0, 0);
        tenggatKembaliDate.setHours(0, 0, 0, 0);

        console.log(
          `today ${today}, twoDaysAfter ${twoDaysAfterToday}, tenggat kembali ${tenggatKembaliDate}`
        );
        return (
          tenggatKembaliDate > today &&
          tenggatKembaliDate <= twoDaysAfterToday &&
          item.status === "Dipinjam"
        );
      });

      setMendekatiDenda(filteredData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const totalPagesMendekatiDenda = Math.ceil(MendekatiDenda.length / perPage);
  const totalPages = Math.ceil(transaksi.length / perPage);

  const dendaCalc = (tenggat_kembali) => {
    let date1 = new Date(tenggat_kembali);
    let date2 = new Date();
    let diffDays = 0;

    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);

    if (date2 > date1) {
      const timeDiff = Math.abs(date2.getTime() - date1.getTime());
      diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    if (diffDays <= 0) {
      return 0;
    } else {
      return diffDays * 10000;
    }
  };

  useEffect(() => {
    fetchTransaksiBuku();
    fetchTransaksiMedekatiDenda();
  }, []);

  const handleDendaTransaksiSelesai = async ({
    transactionID,
    userName,
    userEmail,
  }) => {
    setShowConfirmation(true);
    setActionData({
      transactionID: transactionID,
      userName: userName,
      userEmail: userEmail,
    });
  };

  const handleClosePopUp = () => {
    setIsEmailSent(false);
  };

  const sendEmail = ({ userName, id, tenggatKembali, userEmail }) => {
    emailjs.init("14sHdz2zy8yzTEFIU");
    // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_USER_ID' with your own values
    const serviceID = "service_ig2iwxb";
    const templateID = "template_l30cido";
    const userID = "14sHdz2zy8yzTEFIU";

    const templateParams = {
      user_name: userName,
      id_transaksi: id,
      tenggat_kembali: tenggatKembali,
      userEmail: userEmail,
    };

    // Send email using EmailJS
    emailjs
      .send(serviceID, templateID, templateParams, userID, {
        to_email: userEmail,
      })
      .then((response) => {
        console.log("Email sent successfully!", response);
        console.log(templateParams);
        setIsEmailSent(true);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const sendEmailPengembalian = ({ userName, id, userEmail }) => {
    emailjs.init("14sHdz2zy8yzTEFIU");
    const serviceID = "service_8tc71v8";
    const templateID = "template_7tjjct8";
    const userID = "E63cC9uQSNdfakiaQ";

    const templateParams = {
      user_name: userName,
      id_transaksi: id,
      userEmail: userEmail,
    };

    emailjs
      .send(serviceID, templateID, templateParams, userID, {
        to_email: userEmail,
      })
      .then((response) => {
        console.log("Email sent successfully!", response);
        console.log(templateParams);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  const confirmAction = async () => {
    const { transactionID, userName, userEmail } = actionData;
    const response = await axios.put(
      `https://server.libraryselfservice.site/pengembalian/${transactionID}`,
      { denda: true }
    );
    console.log("Denda terbayar successfully:", response.data);

    const dataTransaksi = await axios.get(
      `https://server.libraryselfservice.site/fetch-transaction/${transactionID}`
    );
    const dataBuku = dataTransaksi.data.kode_barcode.split(",");

    dataBuku.map(async (buku) => {
      await axios.put(
        `https://server.libraryselfservice.site/buku-kembali/${buku}`
      );
      const response = await axios.put(
        `https://server.libraryselfservice.site/data-buku/${buku}`,
        { tersedia: true }
      );
    });
    // console.log(dataBuku);
    sendEmailPengembalian({
      userName: userName,
      id: transactionID,
      userEmail: userEmail,
    });
    fetchTransaksiBuku();

    setShowConfirmation(false);
  };

  return (
    <div>
      <SectionHeading title={"Data Denda"}></SectionHeading>
      <div>
        {isEmailSent && (
          <PopUp
            contentText="Notifikasi terkirim"
            closeBtn={true}
            onClose={handleClosePopUp}
          />
        )}

        <Modal
          show={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          size="md"
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Apakah anda yakin ingin menyelesaikan denda?
              </h3>
              <div className="flex justify-center gap-4">
                <Button onClick={confirmAction}>Selesaikan</Button>
                <Button color="gray" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <div className="my-10 mx-5">
          <h1 className="text-xl font-bold my-3 text-red-500">
            Transaksi Mendekati Denda !
          </h1>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>No.</Table.HeadCell>
              <Table.HeadCell>ID Transaksi</Table.HeadCell>
              <Table.HeadCell>Peminjam</Table.HeadCell>
              <Table.HeadCell>Jumlah Buku Dipinjam</Table.HeadCell>

              <Table.HeadCell>Tenggat Pengembalian</Table.HeadCell>
              <Table.HeadCell>Jumlah Denda</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {MendekatiDenda.slice(
                (currentPage - 1) * perPage,
                currentPage * perPage
              ).map((t, index) => {
                const rowIndex = (currentPage - 1) * perPage + index + 1;
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell>{rowIndex}</Table.Cell>
                    <Table.Cell>{t.id_transaksi}</Table.Cell>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {t.peminjam.nama}
                    </Table.Cell>
                    <Table.Cell> {t.kode_barcode.split(",").length}</Table.Cell>

                    <Table.Cell>
                      {new Date(t.tenggat_kembali).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Table.Cell>
                    <Table.Cell>
                      {dendaCalc(t.tenggat_kembali).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </Table.Cell>
                    <Table.Cell className="grid grid-cols-1 gap-1">
                      <Button
                        size={"xs"}
                        onClick={() => {
                          navigate(`/detail-transaksi/${t.id_transaksi}`);
                        }}
                      >
                        Detail
                      </Button>
                      <Button
                        size={"xs"}
                        color={"warning"}
                        onClick={() => {
                          sendEmail({
                            userName: t.peminjam.nama,
                            id: t.id_transaksi,
                            tenggatKembali: new Date(
                              t.tenggat_kembali
                            ).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }),
                            userEmail: t.peminjam.email,
                          });
                        }}
                      >
                        Kirim Notifikasi
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
              totalPages={totalPagesMendekatiDenda}
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
      <div>
        <div className="my-10 mx-5">
          <h1 className="text-xl font-bold my-3">Denda Transaksi</h1>
          <Table hoverable={true}>
            <Table.Head>
              <Table.HeadCell>No.</Table.HeadCell>
              <Table.HeadCell>ID Transaksi</Table.HeadCell>
              <Table.HeadCell>Peminjam</Table.HeadCell>
              <Table.HeadCell>Jumlah Buku Dipinjam</Table.HeadCell>

              <Table.HeadCell>Tenggat Pengembalian</Table.HeadCell>
              <Table.HeadCell>Jumlah Denda</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {transaksi
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((t, index) => {
                  const rowIndex = (currentPage - 1) * perPage + index + 1;
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      {console.log(t.peminjam)}
                      <Table.Cell>{rowIndex}</Table.Cell>
                      <Table.Cell>{t.id_transaksi}</Table.Cell>
                      <Table.Cell className="font-medium text-gray-900 dark:text-white">
                        {t.peminjam.nama}
                      </Table.Cell>
                      <Table.Cell>
                        {" "}
                        {t.kode_barcode.split(",").length}
                      </Table.Cell>

                      <Table.Cell>
                        {new Date(t.tenggat_kembali).toLocaleDateString(
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
                        {dendaCalc(t.tenggat_kembali).toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </Table.Cell>
                      <Table.Cell className="grid grid-cols-1 gap-1">
                        <Button
                          size={"xs"}
                          onClick={() => {
                            navigate(`/detail-transaksi/${t.id_transaksi}`);
                          }}
                        >
                          Detail
                        </Button>
                        <Button
                          size={"xs"}
                          onClick={() => {
                            handleDendaTransaksiSelesai({
                              transactionID: t.id_transaksi,
                              userName: t.peminjam.nama,
                              userEmail: t.peminjam.email,
                            });
                          }}
                        >
                          Denda Terbayar
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

export default Finedetails;
