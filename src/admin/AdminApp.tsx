import { useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AdminAuthProvider } from "./auth/AdminAuthProvider";
import { useAdminAuth } from "./auth/auth-context";
import { AdminDataProvider } from "./data/AdminDataProvider";
import { AdminLayout } from "./components/AdminLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Orders } from "./pages/Orders";
import { Products } from "./pages/Products";
import { Customers } from "./pages/Customers";
import { Settings } from "./pages/Settings";

/**
 * The admin section is its own app: separate provider tree, separate chrome,
 * and no cart. It mounts under /admin/* from the storefront's router so a
 * single build serves both.
 */
export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireSignIn />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

function RequireSignIn() {
  const { session } = useAdminAuth();
  const location = useLocation();

  if (!session) {
    // Remember where they were headed, so signing in lands them there.
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return (
    <AdminDataProvider>
      <AdminLayout>
        <ScrollToTop />
        <Outlet />
      </AdminLayout>
    </AdminDataProvider>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0 }), [pathname]);
  return null;
}
