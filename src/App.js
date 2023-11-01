import React, { useEffect, useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Books from "./pages/Books";
import Finedetails from "./pages/Finedetails";
import DataPeminjaman from "./pages/DataPeminjaman";
import DataPengembalian from "./pages/DataPengembalian";
import SidebarNew from "./components/SidebarNew";
import TambahBuku from "./pages/TambahBuku";
import EditBuku from "./pages/EditBuku";
import DetailTransaksi from "./pages/DetailTransaksi";
import DetailBuku from "./pages/DetailBuku";
import UserData from "./pages/UserData";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import EditUser from "./pages/EditUser";

function ProtectedRoute({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      setCurrentUser("signedIn");
    } else {
      setCurrentUser(null);
    }
  }, []);

  if (currentUser === undefined) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/*"
        element={
          <SidebarNew>
            <Routes>
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <Books />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/denda"
                element={
                  <ProtectedRoute>
                    <Finedetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-pengembalian"
                element={
                  <ProtectedRoute>
                    <DataPengembalian />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/data-peminjaman"
                element={
                  <ProtectedRoute>
                    <DataPeminjaman />
                  </ProtectedRoute>
                }
              />
              <Route
                path="data-user"
                element={
                  <ProtectedRoute>
                    <UserData />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tambah-buku"
                element={
                  <ProtectedRoute>
                    <TambahBuku />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-buku/:id"
                element={
                  <ProtectedRoute>
                    <EditBuku />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-user/:id"
                element={
                  <ProtectedRoute>
                    <EditUser />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/detail-transaksi/:id"
                element={
                  <ProtectedRoute>
                    <DetailTransaksi />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/detail-buku/:id"
                element={
                  <ProtectedRoute>
                    <DetailBuku />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SidebarNew>
        }
      />
    </Routes>
  );
}

function AppRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppRouter;
