import { Button } from "flowbite-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";

function BackButton() {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        onClick={() => {
          navigate(-1);
        }}
      >
        <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
        <p>Kembali</p>
      </Button>
    </div>
  );
}

export default BackButton;
