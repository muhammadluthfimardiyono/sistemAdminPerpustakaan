import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function TransactionDetailButton({ transaction }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center">
      <Button
        size={"xs"}
        onClick={() => {
          navigate(`/detail-transaksi/${transaction.id_transaksi}`);
        }}
      >
        Detail
      </Button>
    </div>
  );
}

export default TransactionDetailButton;
