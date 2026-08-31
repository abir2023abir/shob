import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ShopProvider } from "@/store/shop";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/Toaster";
import { page } from "@/lib/motion";
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { ProductPage } from "@/pages/ProductPage";
import { Saved } from "@/pages/Saved";
import { Checkout } from "@/pages/Checkout";
import { NotFound } from "@/pages/NotFound";

/**
 * Shoppers should not download the admin panel to look at a product, so it is
 * a separate chunk fetched only when someone actually goes to /admin.
 */
const AdminApp = lazy(() =>
  import("@/admin/AdminApp").then((m) => ({ default: m.AdminApp })),
);

/**
 * Two apps behind one router. The admin section gets its own chrome and its own
 * providers — it has no use for a cart drawer — so it branches above the
 * storefront shell rather than inside it.
 */
export function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<AdminLoading />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="*" element={<Storefront />} />
    </Routes>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-45">
        Loading the panel…
      </p>
    </div>
  );
}

function Storefront() {
  return (
    <ShopProvider>
      <div className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </div>
    </ShopProvider>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/shop") window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={page}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
