import { Table, Pagination } from "flowbite-react";
import React, { useState } from "react";
import TransactionDetailButton from "./TransactionDetailButton";

function TransactionDataTable({ transactions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const storedData = localStorage.getItem("userData");
  const userData = JSON.parse(storedData);

  const totalPages = Math.ceil(transactions.length / perPage);

  return (
    <div>
      <div className="mx-5 my-5">
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>No.</Table.HeadCell>
            <Table.HeadCell>ID Transaksi</Table.HeadCell>
            <Table.HeadCell>Tanggal Pinjam</Table.HeadCell>
            <Table.HeadCell>Tenggat Pengembalian</Table.HeadCell>
            <Table.HeadCell>Tanggal Pengembalian</Table.HeadCell>
            <Table.HeadCell>Jumlah Buku Dipinjam</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {transactions
              .slice((currentPage - 1) * perPage, currentPage * perPage)
              .map((transaction, index) => {
                const rowIndex = (currentPage - 1) * perPage + index + 1;
                return (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell>{rowIndex}</Table.Cell>
                    <Table.Cell>{transaction.id_transaksi}</Table.Cell>
                    <Table.Cell>
                      {new Date(transaction.tanggal_pinjam).toLocaleDateString(
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
                      {new Date(transaction.tenggat_kembali).toLocaleDateString(
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
                      {new Date(transaction.tanggal_kembali).toLocaleDateString(
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
                      {transaction.kode_barcode.split(",").length}
                    </Table.Cell>
                    <Table.Cell>{transaction.status}</Table.Cell>
                    <Table.Cell className="grid grid-cols-1 gap-1">
                      <TransactionDetailButton transaction={transaction} />
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
  );
}

export default TransactionDataTable;
