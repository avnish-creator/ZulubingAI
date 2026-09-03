/* Technical Editorial direction: seminar registration is a short, low-friction path—few fields, clear dates, and an encouraging confirmation state. */
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock, MapPin } from "lucide-react";
import { ConnectPanel, PageHero, PageMeta, SectionLabel } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { upcomingSeminars } from "@/lib/siteData";

function Field({ label, name, type = "text", required = false, placeholder, children }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; children?: React.ReactNode }) {
  return <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}{required && <span className="ml-1 text-teal">*</span>}</span>{children ?? <input name={name} type={type} required={required} placeholder={placeholder} className="form-control" />}</label>;
}

export function SeminarRegistrationForm() {
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
        seminar: String(values.seminar ?? ""),
        honeypot: String(values.honeypot ?? ""),
      });
      setSent(true);
      form.reset();
    } catch {
      setError("We could not deliver your registration right now. Please email development.zulubing@gmail.com directly.");
    }
  };

  if (sent) return <div className="border border-teal/40 bg-teal/10 p-8">
    <div className="flex h-10 w-10 items-center justify-center bg-teal text-ink"><Check size={20} /></div>
    <h3 className="mt-6 font-display text-2xl font-semibold">Your seat is reserved.</h3>
    <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Our team will confirm your seminar registration by email within 24–48 hours and share the joining details.</p>
    <button type="button" onClick={() => setSent(false)} className="text-link mt-7">Register for another seminar <ArrowRight size={15} /></button>
  </div>;

  return <form onSubmit={handleSubmit} className="grid gap-6">
    <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Website<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>

    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Full name" name="studentName" required placeholder="Full name" />
      <Field label="Email address" name="email" type="email" required placeholder="student@email.com" />
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Phone number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" />
      <Field label="Seminar" name="seminar" required><select name="seminar" required className="form-control"><option value="">Select a seminar</option>{upcomingSeminars.map((seminar) => <option key={seminar.slug} value={seminar.title}>{seminar.title}{seminar.date ? ` — ${seminar.date}` : ""}</option>)}</select></Field>
    </div>

    {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}
    <button type="submit" disabled={submit.isPending} className="button-primary w-fit disabled:cursor-wait disabled:opacity-60">{submit.isPending ? "Reserving..." : "Reserve My Seat"} <ArrowUpRight size={15} /></button>
    <p className="text-xs leading-5 text-slate-400">Submitting this form sends your registration securely to the Zulubing team at development.zulubing@gmail.com.</p>
  </form>;
}

export function SeminarsPage() {
  const hasSeminars = upcomingSeminars.length > 0;

  return <>
    <PageMeta title="Upcoming seminars & workshops" description="Register for upcoming Zulubing seminars and workshops on data engineering, analytics, and AI." path="/coaching/seminars" />
    <PageHero eyebrow="08 / SEMINARS" title="Upcoming seminars and workshops." description="Short, focused sessions run by the Zulubing team. Reserve a seat in under a minute.">
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500"><span className="h-1.5 w-1.5 bg-teal" /> LIMITED SEATS <Link href="/coaching" className="text-link">Full coaching programs <ArrowUpRight size={14} /></Link></div>
    </PageHero>

    <main className="bg-paper">
      <section className="py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <SectionLabel index="01">THE SCHEDULE</SectionLabel>
            <h2 className="section-title mt-5">Sessions built around one useful outcome.</h2>
          </div>
          <div>
            {hasSeminars ? <div className="grid gap-5 sm:grid-cols-2">
              {upcomingSeminars.map((seminar) => <article key={seminar.slug} className="border border-slate-300 bg-white p-6">
                <span className="mono-label text-cobalt">UPCOMING</span>
                <h3 className="mt-6 font-display text-xl font-semibold leading-tight">{seminar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{seminar.summary}</p>
                <div className="mt-6 grid gap-2 font-mono text-[11px] uppercase tracking-[0.08em] text-slate-500">
                  <span className="flex items-center gap-2"><CalendarDays size={13} className="text-teal" />{seminar.date}</span>
                  <span className="flex items-center gap-2"><MapPin size={13} className="text-teal" />{seminar.mode}</span>
                </div>
              </article>)}
            </div> : <div className="border border-slate-300 bg-white p-8">
              <div className="flex h-10 w-10 items-center justify-center bg-teal text-ink"><Clock size={20} /></div>
              <h3 className="mt-6 font-display text-2xl font-semibold">The next schedule is being finalised.</h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Seminar dates for the upcoming cycle will be published here shortly. In the meantime, explore the full coaching programs or reach out directly.</p>
              <div className="mt-7 flex flex-wrap gap-3"><Link href="/coaching" className="button-ghost-dark">View coaching programs <ArrowRight size={15} /></Link><Link href="/contact" className="button-primary">Ask about a seminar <ArrowUpRight size={15} /></Link></div>
            </div>}
          </div>
        </div>
      </section>

      {hasSeminars && <section id="register" className="border-y border-slate-200 bg-[#e8efee] py-20 md:py-28">
        <div className="container grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <SectionLabel index="02">REGISTER</SectionLabel>
            <h2 className="section-title mt-5">Reserve your seat.</h2>
            <p className="mt-5 max-w-sm text-base leading-8 text-slate-600">Four details is all we need. We will confirm your seat by email.</p>
          </div>
          <div className="border border-slate-300 bg-white p-7 md:p-9"><SeminarRegistrationForm /></div>
        </div>
      </section>}
    </main>
    <ConnectPanel compact />
  </>;
}
