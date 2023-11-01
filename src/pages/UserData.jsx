import React, { useEffect, useState } from "react";
import SectionHeading from "../components/SectionHeading";
import { Table, Pagination, Button, Modal, Alert } from "flowbite-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function UserData() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [userData, setUserData] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionData, setActionData] = useState({});
  const [successfullyEdit, setSuccessfullyEdit] = useState(false);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `https://server.libraryselfservice.site/user-data`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const totalPages = Math.ceil(userData.length / perPage);

  const handleDelete = async (id) => {
    setShowConfirmation(true);
    setActionData({ action: "delete", id });
  };

  const confirmAction = async () => {
    const { action, id } = actionData;
    if (action === "delete") {
      try {
        const response = await axios.delete(
          `https://server.libraryselfservice.site/user-delete/${id}`
        );
        console.log("User delete successfully:", response.data);
        fetchUser();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
    setShowConfirmation(false);
  };

  useEffect(() => {
    fetchUser();
    if (localStorage.getItem("EditSuccess") === "true") {
      setSuccessfullyEdit(true);
      setTimeout(() => {
        setSuccessfullyEdit(false);
        localStorage.setItem("EditSuccess", "false");
      }, 2000);
    }
  }, []);

  return (
    <div className="mx-5 my-5">
      <SectionHeading title={"Data Anggota Perpustakaan"}></SectionHeading>
      <div>
        {successfullyEdit && (
          <Alert color="success" onDismiss={() => alert("Alert dismissed!")}>
            <span>
              <p>
                <span className="font-medium">Berhasil! </span>
                User berhasil diedit
              </p>
            </span>
          </Alert>
        )}
        <div className="mx-5 my-5">
          <Table hoverable={true} className="">
            <Table.Head>
              <Table.HeadCell>No.</Table.HeadCell>
              <Table.HeadCell>User ID</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Nama</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Email</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Prodi</Table.HeadCell>
              <Table.HeadCell colSpan={2}>NIM</Table.HeadCell>
              <Table.HeadCell colSpan={2}>No. Telepon</Table.HeadCell>
              <Table.HeadCell colSpan={2}>Tanggal Lahir</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userData
                .slice((currentPage - 1) * perPage, currentPage * perPage)
                .map((user, index) => {
                  const rowIndex = (currentPage - 1) * perPage + index + 1;
                  return (
                    <Table.Row
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={index}
                    >
                      <Table.Cell>{rowIndex}</Table.Cell>
                      <Table.Cell>{user.id}</Table.Cell>
                      <Table.Cell colSpan={2}>{user.nama}</Table.Cell>
                      <Table.Cell colSpan={2}>{user.email}</Table.Cell>
                      <Table.Cell colSpan={2}>{user.prodi}</Table.Cell>
                      <Table.Cell colSpan={2}>{user.nim}</Table.Cell>
                      <Table.Cell colSpan={2}>{user.no_telp}</Table.Cell>
                      <Table.Cell colSpan={2}>
                        {new Date(user.tgl_lahir).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Table.Cell>
                      <Table.Cell colSpan={2}>
                        <Button
                          className="w-full"
                          color={"failure"}
                          size={"xs"}
                          onClick={() => handleDelete(user.id)}
                        >
                          Remove
                        </Button>
                        <Link
                          to={`/edit-user/${user.id}`}
                          className="w-full my-2"
                        >
                          <Button size={"xs"} className="w-full my-2">
                            Edit
                          </Button>
                        </Link>
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
                ? "Apakah anda yakin ingin menghapus pengguna?"
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
}

export default UserData;
