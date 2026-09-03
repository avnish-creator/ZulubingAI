/* Technical Editorial direction: free workshop registration is the lowest-friction path on the site—three fields, one opt-in, and an immediate confirmation. */
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, Gift, Mail, Video } from "lucide-react";
import { ConnectPanel, PageHero, PageMeta, SectionLabel } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { CURRENT_WORKSHOP } from "@shared/const";

function Field({ label, name, type = "text", required = false, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}{required && <span className="ml-1 text-teal">*</span>}</span><input name={name} type={type} required={required} placeholder={placeholder} className="form-control" /></label>;
}

export function WorkshopRegistrationForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = trpc.workshops.enroll.useMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await submit.mutateAsync({
        studentName: String(values.studentName ?? ""),
        email: String(values.email ?? ""),
        phone: String(values.phone ?? ""),
        jobReadyInterest: values.jobReadyInterest === "on",
        honeypot: String(values.honeypot ?? ""),
      });
      setSent(true);
      form.reset();
    } catch {
      setError("We could not register you right now. Please email development.zulubing@gmail.com directly.");
    }
  };

  if (sent) return <div className="border border-teal/40 bg-teal/10 p-8">
    <div className="flex h-10 w-10 items-center justify-center bg-teal text-ink"><Check size={20} /></div>
    <h3 className="mt-6 font-display text-2xl font-semibold">You are registered.</h3>
    <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">We will email your joining link to the address you gave us before the session starts. Do check your spam folder if you do not see it.</p>
    <button type="button" onClick={() => setSent(false)} className="text-link mt-7">Register someone else <ArrowRight size={15} /></button>
  </div>;

  return <form onSubmit={handleSubmit} className="grid gap-6">
    <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Website<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>

    <Field label="Your name" name="studentName" required placeholder="Full name" />
    <Field label="Email address" name="email" type="email" required placeholder="you@email.com" />
    <Field label="Phone number" name="phone" type="tel" placeholder="Optional" />

    <label className="flex cursor-pointer items-start gap-3 border border-slate-300 bg-white p-4 transition hover:border-teal">
      <input name="jobReadyInterest" type="checkbox" className="mt-0.5 h-4 w-4 flex-none accent-teal" />
      <span className="text-sm leading-6 text-slate-600">Yes, tell me about upcoming <strong className="font-semibold text-ink">job-ready live sessions</strong> too.</span>
    </label>

    {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}
    <button type="submit" disabled={submit.isPending} className="button-primary w-fit disabled:cursor-wait disabled:opacity-60">{submit.isPending ? "Registering..." : "Register Free"} <ArrowUpRight size={15} /></button>
    <p className="text-xs leading-5 text-slate-400">Free to attend. We use your email only to send the joining link and session updates.</p>
  </form>;
}

export function WorkshopPage() {
  return <>
    <PageMeta title={`${CURRENT_WORKSHOP} — free registration`} description={`Register free for the Zulubing ${CURRENT_WORKSHOP}. Enter your details and we will email you the joining link.`} path="/coaching/workshop" />
    <PageHero eyebrow="08 / WORKSHOP" title={`${CURRENT_WORKSHOP}.`} description="A free, live session on turning raw data into decisions. Register in under a minute and we will email you the joining link.">
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500"><span className="h-1.5 w-1.5 bg-teal" /> FREE TO ATTEND <Link href="/coaching" className="text-link">Coaching programs <ArrowUpRight size={14} /></Link></div>
    </PageHero>

    <main className="bg-paper">
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <SectionLabel index="01">REGISTER</SectionLabel>
            <h2 className="section-title mt-5">Save your spot.</h2>
            <div className="mt-8 grid gap-4">
              {[{ icon: Gift, title: "Free to attend", copy: "No fee, no prerequisites." },
                { icon: Video, title: "Live session", copy: "Join online, ask questions in real time." },
                { icon: Mail, title: "Link by email", copy: "We send the joining link to your inbox." }].map((item) => <div key={item.title} className="flex gap-4">
                <span className="flex h-9 w-9 flex-none items-center justify-center bg-teal text-ink"><item.icon size={17} /></span>
                <span><span className="block text-sm font-semibold text-ink">{item.title}</span><span className="mt-1 block text-sm leading-6 text-slate-600">{item.copy}</span></span>
              </div>)}
            </div>
          </div>
          <div className="border border-slate-300 bg-white p-7 md:p-9"><WorkshopRegistrationForm /></div>
        </div>
      </section>
    </main>
    <ConnectPanel compact />
  </>;
}
