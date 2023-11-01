import React, { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import SearchBar from "../components/SearchBar";
import { Table, Button, Alert, Pagination, Modal, Badge } from "flowbite-react";
import { MdAddCircleOutline } from "react-icons/md";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BarcodePDF from "../components/BarcodePDF";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import DetailButton from "../components/DetailButton";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [successfullyAdded, setSuccessfullyAdded] = useState(false);
  const [successfullyEdit, setSuccessfullyEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionData, setActionData] = useState({});
  const [stokBuku, setStokBuku] = useState(0);
  const [stokBukuTersedia, setStokBukuTersedia] = useState(0);
  const [stokBukuTidakTersedia, setStokBukuTidakTersedia] = useState(0);

  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `https://server.libraryselfservice.site/books`
      );

      const bukuTersedia = response.data.filter((data) => {
        return data.tersedia === 1;
      });

      const bukuTidakTersedia = response.data.filter((data) => {
        return data.tersedia === 0;
      });

      const sortedBooks = response.data.sort((a, b) => b.no_buku - a.no_buku);

      setStokBuku(response.data.length);
      setStokBukuTersedia(bukuTersedia.length);
      setStokBukuTidakTersedia(bukuTidakTersedia.length);

      setBooks(sortedBooks);
      setBooksData(sortedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleDelete = async (kodeBarcode) => {
    setShowConfirmation(true);
    setActionData({ action: "delete", kodeBarcode });
  };

  const handleDuplicate = async (kode_barcode) => {
    setShowConfirmation(true);
    setActionData({ action: "duplicate", kodeBarcode: kode_barcode });
  };

  const confirmAction = async () => {
    const { action, kodeBarcode } = actionData;
    if (action === "delete") {
      try {
        const response = await axios.delete(
          `https://server.libraryselfservice.site/delete-buku/${kodeBarcode}`
        );
        console.log("Transaction added successfully:", response.data);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    } else if (action === "duplicate") {
      try {
        const response = await axios.post(
          `https://server.libraryselfservice.site/duplicate-buku/${kodeBarcode}`
        );
        console.log(response);
        fetchBooks();
      } catch (error) {
        console.error("Error duplicating book:", error);
      }
    }

    setShowConfirmation(false);
  };

  const totalPages = Math.ceil(books.length / perPage);

  useEffect(() => {
    fetchBooks();
    if (localStorage.getItem("addSuccess") === "true") {
      setSuccessfullyAdded(true);
      setTimeout(() => {
        setSuccessfullyAdded(false);
        localStorage.setItem("addSuccess", "false");
      }, 2000);
    }
    if (localStorage.getItem("EditSuccess") === "true") {
      setSuccessfullyEdit(true);
      setTimeout(() => {
        setSuccessfullyEdit(false);
        localStorage.setItem("EditSuccess", "false");
      }, 2000);
    }
  }, []);

  const searchBooks = (searchQuery) => {
    setBooks(searchQuery);
    setCurrentPage(1);
  };

  return (
    <div className="mx-5 my-5">
      <SectionHeading title={"Data Buku"}></SectionHeading>
      {successfullyAdded && (
        <Alert color="success" onDismiss={() => alert("Alert dismissed!")}>
          <span>
            <p>
              <span className="font-medium">Berhasil! </span>
              Buku berhasil ditambahkan
            </p>
          </span>
        </Alert>
      )}
      {successfullyEdit && (
        <Alert color="success" onDismiss={() => alert("Alert dismissed!")}>
          <span>
            <p>
              <span className="font-medium">Berhasil! </span>
              Buku berhasil diedit
            </p>
          </span>
        </Alert>
      )}
      <div className=" mx-10 mt-10 mb-5 flex justify-between items-center">
        <h2 className="text-2xl font-bold">List Buku</h2>
        <Link to={"/tambah-buku"}>
          <Button className="w-fit">
            <MdAddCircleOutline className="mr-2 h-5 w-5" />
            <p>Tambah Buku</p>
          </Button>
        </Link>
      </div>
      <hr
        style={{
          border: "0.5px solid #e2dddd",
        }}
      />
      <div>
        <div className="mx-5 grid grid-cols-5 gap-1 items-center ">
          <div>
            <span className="font-bold">Stok Buku : </span>
            <span className="font-bold">{stokBuku}</span>
          </div>
          <div>
            <span className="font-bold">Stok Buku Tersedia : </span>
            <span className="font-bold">{stokBukuTersedia}</span>
          </div>
          <div>
            <span className="font-bold">Stok Buku Tidak Tersedia : </span>
            <span className="font-bold">{stokBukuTidakTersedia}</span>
          </div>

          <div className="col-span-2">
            <SearchBar data={booksData} onSearch={searchBooks} />
          </div>
        </div>

        <div className="mx-5 my-5">
          <Table hoverable={true} className="table-fixed">
            <Table.Head>
              <Table.HeadCell colSpan={2}>Judul</Table.HeadCell>
              <Table.HeadCell>Pengarang</Table.HeadCell>
              <Table.HeadCell>Penerbit</Table.HeadCell>
              <Table.HeadCell>Tahun Terbit</Table.HeadCell>
              <Table.HeadCell>Kode Barcode</Table.HeadCell>
              <Table.HeadCell>Kode Rak</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell className="text-center">Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {books
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((book, index) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell
                      className="font-medium text-gray-900 dark:text-white"
                      colSpan={2}
                    >
                      {book.judul}
                    </Table.Cell>
                    <Table.Cell>{book.pengarang}</Table.Cell>
                    <Table.Cell>{book.penerbit}</Table.Cell>
                    <Table.Cell>{book.tahun_terbit}</Table.Cell>
                    <Table.Cell>{book.kode_barcode}</Table.Cell>
                    <Table.Cell>{book.kode_rak}</Table.Cell>
                    <Table.Cell>
                      {book.tersedia === 1 ? (
                        <div className="w-fit">
                          <Badge
                            color={"success"}
                            size={"sm"}
                            className="text-center"
                          >
                            Tersedia
                          </Badge>
                        </div>
                      ) : (
                        <Badge
                          color={"failure"}
                          size={"sm"}
                          className="text-center"
                        >
                          Tidak Tersedia
                        </Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell className="grid grid-cols-1 gap-1">
                      <Button size={"xs"}>
                        <PDFDownloadLink
                          document={
                            <BarcodePDF barcodeData={book.kode_barcode} />
                          }
                          fileName="barcode.pdf"
                        >
                          {({ blob, url, loading, error }) =>
                            loading ? "Generating PDF..." : "Download PDF"
                          }
                        </PDFDownloadLink>
                      </Button>

                      <Button
                        color={"failure"}
                        size={"xs"}
                        onClick={() => handleDelete(book.kode_barcode)}
                      >
                        Remove
                      </Button>
                      <Button
                        size={"xs"}
                        onClick={() => handleDuplicate(book.kode_barcode)}
                      >
                        Duplicate
                      </Button>
                      <Button
                        size={"xs"}
                        onClick={() => {
                          navigate(`/edit-buku/${book.kode_barcode}`);
                        }}
                      >
                        Edit
                      </Button>
                      <DetailButton book={book}></DetailButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
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

      <Modal
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        size="sm"
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {actionData.action === "delete"
                ? "Apakah anda yakin ingin menghapus buku?"
                : actionData.action === "duplicate"
                ? "Apakah anda yakin ingin menggandakan buku?"
                : "Are you sure you want to proceed?"}
            </h3>
            <div className="flex justify-center gap-4">
              <Button onClick={confirmAction}>Confirm</Button>
              <Button color="gray" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Books;
