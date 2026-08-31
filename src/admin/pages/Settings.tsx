import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ExternalLink, RotateCcw, Save } from "lucide-react";
import { money } from "@/lib/format";
import { fadeUp, stagger } from "@/lib/motion";
import { Confirm, Field, Panel } from "../components/ui";
import { useAdmin } from "../data/admin-context";
import type { StoreSettings } from "../lib/types";

type Form = {
  storeName: string;
  supportPhone: string;
  deliveryFee: string;
  freeDeliveryAt: string;
  promoCode: string;
  promoOff: string;
  lowStockAt: string;
  defaultCurrency: StoreSettings["defaultCurrency"];
};

const toForm = (s: StoreSettings): Form => ({
  storeName: s.storeName,
  supportPhone: s.supportPhone,
  deliveryFee: String(s.deliveryFee),
  freeDeliveryAt: String(s.freeDeliveryAt),
  promoCode: s.promoCode,
  promoOff: String(Math.round(s.promoOff * 100)),
  lowStockAt: String(s.lowStockAt),
  defaultCurrency: s.defaultCurrency,
});

function validate(form: Form): Partial<Record<keyof Form, string>> {
  const errors: Partial<Record<keyof Form, string>> = {};
  const fee = Number(form.deliveryFee);
  const free = Number(form.freeDeliveryAt);
  const off = Number(form.promoOff);
  const low = Number(form.lowStockAt);

  if (form.storeName.trim().length < 2) errors.storeName = "The shop needs a name.";
  if (!/^01[3-9]\d{8}$/.test(form.supportPhone.trim()))
    errors.supportPhone = "Use an 11-digit number starting 01.";
  if (!Number.isFinite(fee) || fee < 0) errors.deliveryFee = "Zero or more.";
  if (!Number.isFinite(free) || free <= 0) errors.freeDeliveryAt = "Must be more than zero.";
  if (!/^[A-Z0-9]{4,12}$/i.test(form.promoCode.trim()))
    errors.promoCode = "Four to twelve letters or digits.";
  if (!Number.isFinite(off) || off < 0 || off > 90) errors.promoOff = "Between 0 and 90 percent.";
  if (!Number.isFinite(low) || low < 0 || !Number.isInteger(low))
    errors.lowStockAt = "A whole number, zero or more.";

  return errors;
}

export function Settings() {
  const { settings, saveSettings, resetDemoData } = useAdmin();
  const [form, setForm] = useState<Form>(() => toForm(settings));
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [resetting, setResetting] = useState(false);

  // A reset rewrites settings from underneath the form.
  useEffect(() => setForm(toForm(settings)), [settings]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    saveSettings({
      storeName: form.storeName.trim(),
      supportPhone: form.supportPhone.trim(),
      deliveryFee: Number(form.deliveryFee),
      freeDeliveryAt: Number(form.freeDeliveryAt),
      promoCode: form.promoCode.trim().toUpperCase(),
      promoOff: Number(form.promoOff) / 100,
      lowStockAt: Number(form.lowStockAt),
      defaultCurrency: form.defaultCurrency,
    });
  };

  return (
    <motion.div
      variants={stagger(0, 0.05)}
      initial="hidden"
      animate="show"
      className="max-w-3xl space-y-4"
    >
      <motion.div variants={fadeUp}>
        <h1 className="text-[clamp(24px,3vw,30px)] font-extrabold text-ink">Settings</h1>
        <p className="mt-1 text-[13.5px] text-ink-70">
          These numbers drive the storefront's bag and checkout, not just this panel.
        </p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel title="Shop">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Shop name" error={errors.storeName}>
              <input
                className="field"
                value={form.storeName}
                onChange={(e) => set("storeName", e.target.value)}
              />
            </Field>
            <Field label="Support number" error={errors.supportPhone}>
              <input
                className="field font-mono"
                value={form.supportPhone}
                onChange={(e) => set("supportPhone", e.target.value)}
                placeholder="017XXXXXXXX"
              />
            </Field>
            <Field label="Prices shown in" hint="admin panel default">
              <select
                className="field"
                value={form.defaultCurrency}
                onChange={(e) => set("defaultCurrency", e.target.value as Form["defaultCurrency"])}
              >
                <option value="BDT">Taka (৳)</option>
                <option value="USD">Dollars ($)</option>
              </select>
            </Field>
            <Field label="Low stock alert at" hint="units" error={errors.lowStockAt}>
              <input
                className="field font-mono"
                inputMode="numeric"
                value={form.lowStockAt}
                onChange={(e) => set("lowStockAt", e.target.value)}
              />
            </Field>
          </div>
        </Panel>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel title="Delivery and promotions">
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="Delivery fee" hint="৳" error={errors.deliveryFee}>
              <input
                className="field font-mono"
                inputMode="numeric"
                value={form.deliveryFee}
                onChange={(e) => set("deliveryFee", e.target.value)}
              />
            </Field>
            <Field label="Free delivery over" hint="৳" error={errors.freeDeliveryAt}>
              <input
                className="field font-mono"
                inputMode="numeric"
                value={form.freeDeliveryAt}
                onChange={(e) => set("freeDeliveryAt", e.target.value)}
              />
            </Field>
            <Field label="Promo code" error={errors.promoCode}>
              <input
                className="field font-mono uppercase"
                value={form.promoCode}
                onChange={(e) => set("promoCode", e.target.value)}
              />
            </Field>
            <Field label="Promo discount" hint="%" error={errors.promoOff}>
              <input
                className="field font-mono"
                inputMode="numeric"
                value={form.promoOff}
                onChange={(e) => set("promoOff", e.target.value)}
              />
            </Field>
          </div>

          <p className="border-t border-line px-5 py-3 text-[12px] text-ink-45">
            A ৳{form.freeDeliveryAt || 0} basket ships free; anything under it pays{" "}
            {money(Number(form.deliveryFee) || 0)}. Code{" "}
            <span className="font-mono font-bold text-ink-70">
              {form.promoCode.toUpperCase() || "—"}
            </span>{" "}
            takes {form.promoOff || 0}% off.
          </p>
        </Panel>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={submit} className="btn-primary">
          <Save size={15} />
          Save settings
        </button>
        <Link to="/" className="btn-quiet">
          <ExternalLink size={15} />
          Open the storefront
        </Link>
      </motion.div>

      <motion.div variants={fadeUp}>
        <Panel title="Demo data" className="border-rose/30">
          <div className="flex flex-wrap items-center gap-4 p-5">
            <p className="min-w-[240px] flex-1 text-[13px] leading-relaxed text-ink-70">
              Rebuilds the catalogue and the order history from the shipped seed. Every product
              edit, status change, and setting on this device is thrown away.
            </p>
            <button
              type="button"
              onClick={() => setResetting(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose px-4 py-2.5 text-sm font-semibold text-rose"
            >
              <RotateCcw size={15} />
              Reset demo data
            </button>
          </div>
        </Panel>
      </motion.div>

      <Confirm
        open={resetting}
        title="Reset everything?"
        body="The catalogue, the orders, and these settings go back to how they shipped. There is no undo."
        confirmLabel="Reset it all"
        onCancel={() => setResetting(false)}
        onConfirm={() => {
          resetDemoData();
          setResetting(false);
        }}
      />
    </motion.div>
  );
}
