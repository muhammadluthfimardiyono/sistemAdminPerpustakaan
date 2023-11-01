import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

function LogOutButton() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogout = () => {
    setShowConfirmation(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("firstRender");
    navigate("/");
  };

  return (
    <div>
      <Button onClick={handleLogout} color={"failure"}>
        Logout
      </Button>
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
              Apakah anda yakin ingin Logout?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmLogout}>
                Logout
              </Button>
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

export default LogOutButton;
