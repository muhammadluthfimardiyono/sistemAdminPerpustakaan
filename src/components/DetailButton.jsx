import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function DetailButton({ book }) {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <Button
        className="m-0 p-0 w-full"
        size={"xs"}
        onClick={() => {
          navigate(`/detail-buku/${book.kode_barcode}`);
        }}
      >
        Detail
      </Button>
    </div>
  );
}

export default DetailButton;
