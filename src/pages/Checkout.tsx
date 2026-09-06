import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CreditCard, Package, Smartphone, Truck, Wallet } from "lucide-react";
import { useShop } from "@/store/shop-context";
import { money, orderNumber } from "@/lib/format";
import { fadeUp, spring, stagger } from "@/lib/motion";
import { ProductArt } from "@/components/ProductArt";

const STEPS = ["Delivery", "Payment", "Review"] as const;

const DIVISIONS = [
  "Barishal", "Chattogram", "Dhaka", "Khulna",
  "Mymensingh", "Rajshahi", "Rangpur", "Sylhet",
];

const METHODS = [
  { id: "bkash", label: "bKash", note: "Pay from your wallet", icon: Smartphone },
  { id: "nagad", label: "Nagad", note: "Pay from your wallet", icon: Wallet },
  { id: "card", label: "Card", note: "Visa, Mastercard, Amex", icon: CreditCard },
  { id: "cod", label: "Cash on delivery", note: "Pay the rider", icon: Truck },
] as const;

interface Form {
  name: string;
  phone: string;
  address: string;
  city: string;
  division: string;
  method: string;
  note: string;
}

export function Checkout() {
  const { lines, totals, currency, promoApplied, placeOrder } = useShop();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [form, setForm] = useState<Form>({
    name: "", phone: "", address: "", city: "", division: "Dhaka", method: "bkash", note: "",
  });

  const set = (key: keyof Form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateDelivery = () => {
    const next: Partial<Record<keyof Form, string>> = {};
    if (form.name.trim().length < 2) next.name = "Enter the name on the delivery.";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim()))
      next.phone = "Use an 11-digit number starting 01.";
    if (form.address.trim().length < 8) next.address = "Add house, road, and area.";
    if (form.city.trim().length < 2) next.city = "Which city or upazila?";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const advance = () => {
    if (step === 0 && !validateDelivery()) return;
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = () => {
    const ref = orderNumber();
    placeOrder(ref);
    setPlaced(ref);
    window.scrollTo({ top: 0 });
  };

  /* ── Confirmation ───────────────────────────────────────── */
  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="rounded-full bg-jade-soft p-5"
        >
          <Check size={34} className="text-jade" strokeWidth={3} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 text-[clamp(28px,4vw,38px)] font-extrabold text-ink"
        >
          Order placed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-3 text-[15px] leading-relaxed text-ink-70"
        >
          Reference <span className="font-mono font-bold text-ink">{placed}</span>. A confirmation
          would normally reach {form.phone || "your phone"} within a minute — this is a portfolio
          demo, so nothing was charged and nothing will ship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex gap-3"
        >
          <Link to="/shop" className="btn-ink">Keep shopping</Link>
          <Link to="/" className="btn-quiet py-3">Back home</Link>
        </motion.div>
      </div>
    );
  }

  /* ── Empty bag ──────────────────────────────────────────── */
  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
        <div className="rounded-3xl bg-canvas p-6">
          <Package size={32} className="text-ink-45" />
        </div>
        <h1 className="mt-6 text-[28px] font-extrabold text-ink">Your bag is empty</h1>
        <p className="mt-2 text-[15px] text-ink-70">
          Add something from the catalogue and checkout will open up.
        </p>
        <Link to="/shop" className="btn-ink mt-6">Browse the catalogue</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <button
        type="button"
        onClick={() => (step === 0 ? navigate(-1) : setStep((s) => s - 1))}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-70 hover:text-ink"
      >
        <ArrowLeft size={15} /> {step === 0 ? "Back" : STEPS[step - 1]}
      </button>

      <h1 className="mt-4 text-[clamp(28px,4vw,40px)] font-extrabold text-ink">Checkout</h1>

      {/* Step rail */}
      <ol className="mt-6 flex items-center gap-3" aria-label="Checkout progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                  i <= step ? "bg-ink text-white" : "bg-canvas text-ink-45"
                }`}
              >
                {i < step ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              <span className={`text-[13px] font-semibold ${i <= step ? "text-ink" : "text-ink-45"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px flex-1 overflow-hidden bg-line">
                <motion.div
                  className="h-full bg-ink"
                  initial={false}
                  animate={{ width: i < step ? "100%" : "0%" }}
                  transition={spring}
                />
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-line bg-surface p-5 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stagger(0, 0.05)}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <motion.h2 variants={fadeUp} className="font-display text-[19px] font-bold text-ink">
                    Where should it go?
                  </motion.h2>

                  <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name}>
                      <input
                        className="field"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Saiful Islam"
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Mobile number" error={errors.phone}>
                      <input
                        className="field font-mono"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="017XXXXXXXX"
                        inputMode="numeric"
                        autoComplete="tel"
                      />
                    </Field>
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <Field label="Street address" error={errors.address}>
                      <input
                        className="field"
                        value={form.address}
                        onChange={(e) => set("address", e.target.value)}
                        placeholder="House 12, Road 4, Mohammadpur"
                        autoComplete="street-address"
                      />
                    </Field>
                  </motion.div>

                  <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                    <Field label="City or upazila" error={errors.city}>
                      <input
                        className="field"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                        placeholder="Rajshahi"
                      />
                    </Field>
                    <Field label="Division">
                      <select
                        className="field"
                        value={form.division}
                        onChange={(e) => set("division", e.target.value)}
                      >
                        {DIVISIONS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <Field label="Delivery note (optional)">
                      <input
                        className="field"
                        value={form.note}
                        onChange={(e) => set("note", e.target.value)}
                        placeholder="Call before arriving"
                      />
                    </Field>
                  </motion.div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <motion.h2 variants={fadeUp} className="font-display text-[19px] font-bold text-ink">
                    How would you like to pay?
                  </motion.h2>
                  <motion.div variants={fadeUp} className="mt-4 grid gap-3 sm:grid-cols-2">
                    {METHODS.map(({ id, label, note, icon: Icon }) => {
                      const active = form.method === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => set("method", id)}
                          aria-pressed={active}
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                            active ? "border-violet bg-violet-soft" : "border-line bg-surface hover:border-ink-20"
                          }`}
                        >
                          <span className={`rounded-xl p-2.5 ${active ? "bg-violet" : "bg-canvas"}`}>
                            <Icon size={17} className={active ? "text-white" : "text-ink-70"} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[14px] font-semibold text-ink">{label}</span>
                            <span className="block text-[12px] text-ink-45">{note}</span>
                          </span>
                          {active && (
                            <motion.span layoutId="pay-check" className="ml-auto">
                              <Check size={16} className="text-violet" strokeWidth={3} />
                            </motion.span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                  <motion.p variants={fadeUp} className="mt-4 text-[12.5px] text-ink-45">
                    This demo does not connect to a payment gateway. In production this step would
                    hand off to SSLCommerz or bKash Checkout and return with a transaction ID.
                  </motion.p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <motion.h2 variants={fadeUp} className="font-display text-[19px] font-bold text-ink">
                    Check it over
                  </motion.h2>

                  <motion.dl variants={fadeUp} className="overflow-hidden rounded-2xl border border-line">
                    <ReviewRow label="Deliver to" value={`${form.name} · ${form.phone}`} />
                    <ReviewRow
                      label="Address"
                      value={`${form.address}, ${form.city}, ${form.division}`}
                      alt
                    />
                    <ReviewRow
                      label="Payment"
                      value={METHODS.find((m) => m.id === form.method)?.label ?? ""}
                    />
                    {form.note && <ReviewRow label="Note" value={form.note} alt />}
                  </motion.dl>

                  <motion.ul variants={fadeUp} className="space-y-3">
                    {lines.map((l) => (
                      <li key={l.key} className="flex items-center gap-3">
                        <ProductArt product={l.product} sizes="48px" className="aspect-square w-12 rounded-xl" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-semibold text-ink">
                            {l.product.name}
                          </p>
                          <p className="font-mono text-[11.5px] text-ink-45">× {l.qty}</p>
                        </div>
                        <span className="font-mono text-[13px] font-bold">
                          {money(l.product.price * l.qty, currency)}
                        </span>
                      </li>
                    ))}
                  </motion.ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-7 flex justify-end">
            {step < STEPS.length - 1 ? (
              <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={advance} className="btn-primary px-5 py-3.5">
                Continue to {STEPS[step + 1]} <ArrowRight size={16} />
              </motion.button>
            ) : (
              <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={submit} className="btn-primary px-5 py-3.5">
                Place order · {money(totals.total, currency)}
              </motion.button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-36 lg:self-start">
          <div className="rounded-3xl border border-line bg-surface p-5">
            <h2 className="font-display text-[17px] font-bold text-ink">Order summary</h2>
            <dl className="mt-4 space-y-1.5">
              <SummaryRow label={`Items (${lines.length})`} value={money(totals.subtotal, currency)} />
              {promoApplied && (
                <SummaryRow label="Promo SHOB10" value={`−${money(totals.discount, currency)}`} />
              )}
              <SummaryRow
                label="Delivery"
                value={totals.delivery === 0 ? "Free" : money(totals.delivery, currency)}
              />
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="text-[15px] font-bold text-ink">Total</dt>
                <dd className="font-mono text-[18px] font-bold text-ink">
                  {money(totals.total, currency)}
                </dd>
              </div>
            </dl>
            {totals.savings > 0 && (
              <p className="mt-3 rounded-xl bg-jade-soft px-3 py-2 text-[12.5px] font-semibold text-jade-deep">
                You are saving {money(totals.savings, currency)} on this order.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-70">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-[11.5px] text-rose"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function ReviewRow({ label, value, alt = false }: { label: string; value: string; alt?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 px-4 py-3 text-[13.5px] ${alt ? "bg-canvas/60" : ""}`}>
      <dt className="shrink-0 text-ink-45">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px] text-ink-70">
      <dt>{label}</dt>
      <dd className="font-mono">{value}</dd>
    </div>
  );
}
