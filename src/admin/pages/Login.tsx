import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Eye, EyeOff, Lock, ShieldAlert, User } from "lucide-react";
import { AuroraField } from "@/components/AuroraField";
import { LogoMark } from "@/components/Logo";
import { fadeUp, stagger } from "@/lib/motion";
import { Field } from "../components/ui";
import { useAdminAuth } from "../auth/auth-context";

export function Login() {
  const { session, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (session) return <Navigate to={location.state?.from ?? "/admin"} replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const message = await signIn(user, password, remember);
    setBusy(false);
    if (message) {
      setError(message);
      return;
    }
    navigate(location.state?.from ?? "/admin", { replace: true });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-12">
      <AuroraField />

      <motion.div
        variants={stagger(0.05, 0.07)}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-sm"
      >
        <motion.div variants={fadeUp} className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <span className="flex items-baseline gap-1.5">
              <span className="font-display text-[26px] font-extrabold tracking-tightest text-ink">
                shob
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-violet">
                admin
              </span>
            </span>
          </Link>
          <h1 className="mt-4 text-[26px] font-extrabold text-ink">Sign in to the panel</h1>
          <p className="mt-1.5 text-[13.5px] text-ink-70">
            Orders, stock, and store settings in one place.
          </p>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={submit}
          className="mt-7 space-y-4 rounded-3xl border border-line bg-surface p-6 shadow-lift"
        >
          <Field label="Username">
            <div className="relative">
              <User
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-45"
              />
              <input
                className="field pl-10"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                  setError(null);
                }}
                placeholder="saiful"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
          </Field>

          <Field label="Password">
            <div className="relative">
              <Lock
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-45"
              />
              <input
                className="field pl-10 pr-11"
                type={reveal ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink-45 hover:text-ink-70"
              >
                {reveal ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink-70">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-violet"
            />
            Keep me signed in on this device
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="rounded-xl bg-rose-soft px-3 py-2.5 text-[12.5px] font-medium text-rose"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={busy}
            whileTap={busy ? undefined : { scale: 0.98 }}
            className="btn-primary w-full py-3.5 text-[15px]"
          >
            {busy ? "Checking…" : "Sign in"}
            {!busy && <ArrowRight size={16} />}
          </motion.button>
        </motion.form>

        <motion.div
          variants={fadeUp}
          className="mt-4 rounded-2xl border border-dashed border-line bg-surface/70 p-4"
        >
          <p className="flex items-center gap-2 text-[12px] font-semibold text-ink-70">
            <ShieldAlert size={14} className="text-marigold-deep" />
            Demo credentials
          </p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[12.5px]">
            <dt className="text-ink-45">user</dt>
            <dd className="font-bold text-ink">saiful</dd>
            <dt className="text-ink-45">pass</dt>
            <dd className="font-bold text-ink">abir12##</dd>
          </dl>
          <p className="mt-2.5 text-[11.5px] leading-relaxed text-ink-45">
            This check runs in the browser, so it is a demo gate rather than real security. In
            production it becomes one call to your auth endpoint.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
