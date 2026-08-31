/* Technical Editorial direction: contact flows are calm, direct, and operational—clear field labels, strong contrast, and a next-step message instead of salesy celebration. */
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, Mail, MapPin, Phone } from "lucide-react";
import { ConnectPanel, PageHero, PageMeta, SectionLabel } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";

const services = ["Data Engineering", "Analytics & BI", "Cloud Data Solutions", "AI & Machine Learning", "Data Governance & Security", "Managed Data Services", "Not sure yet"];
const timelines = ["Exploring", "0–3 months", "3–6 months", "6–12 months", "Not sure yet"];

function Field({ label, name, type = "text", required = false, placeholder, children }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; children?: React.ReactNode }) {
  return <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}{required && <span className="ml-1 text-teal">*</span>}</span>{children ?? <input name={name} type={type} required={required} placeholder={placeholder} className="form-control" />}</label>;
}

export function ContactForm({ short = false, kind = "contact" }: { short?: boolean; kind?: "contact" | "expert" | "careers" }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = trpc.contact.submit.useMutation();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await submit.mutateAsync({ kind, name: String(values.name ?? ""), email: String(values.email ?? ""), company: String(values.company ?? ""), title: String(values.title ?? ""), country: String(values.country ?? ""), phone: String(values.phone ?? ""), service: String(values.service ?? ""), platform: String(values.platform ?? ""), description: String(values.description ?? ""), timeline: String(values.timeline ?? ""), additional: String(values.additional ?? ""), honeypot: String(values.honeypot ?? "") });
      setSent(true);
      form.reset();
    } catch {
      setError("We could not deliver your message right now. Please email development.zulubing@gmail.com directly.");
    }
  };
  if (sent) return <div className="border border-teal/40 bg-teal/10 p-8"><div className="flex h-10 w-10 items-center justify-center bg-teal text-ink"><Check size={20} /></div><h3 className="mt-6 font-display text-2xl font-semibold">Thank you for reaching out to Zulubing.</h3><p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Our team will review your message and get back to you soon.</p><button type="button" onClick={() => setSent(false)} className="text-link mt-7">Send another message <ArrowRight size={15} /></button></div>;
  return <form onSubmit={handleSubmit} className="grid gap-6">
    <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Website<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>
    <div className="grid gap-6 sm:grid-cols-2"><Field label="Full name" name="name" required placeholder="Your name" /><Field label="Work email" name="email" type="email" required placeholder="you@company.com" /></div>
    {!short && <div className="grid gap-6 sm:grid-cols-2"><Field label="Company" name="company" placeholder="Company name" /><Field label="Job title" name="title" placeholder="Your role" /></div>}
    {!short && <div className="grid gap-6 sm:grid-cols-2"><Field label="Country" name="country" placeholder="Country" /><Field label="Phone number" name="phone" type="tel" placeholder="Optional" /></div>}
    <Field label="Service interested in" name="service"><select name="service" className="form-control"><option value="">Select a service</option>{services.map((service) => <option key={service} value={service}>{service}</option>)}</select></Field>
    <Field label="Current technology / data platform" name="platform" placeholder="Optional context" />
    <Field label="Project description" name="description" required={!short} placeholder="What are you trying to solve?" ><textarea name="description" required={!short} rows={5} placeholder="What are you trying to solve?" className="form-control resize-y" /></Field>
    <div className="grid gap-6 sm:grid-cols-2"><Field label="Expected timeline" name="timeline"><select name="timeline" className="form-control"><option value="">Select a timeline</option>{timelines.map((timeline) => <option key={timeline} value={timeline}>{timeline}</option>)}</select></Field>{!short && <Field label="Additional information" name="additional" placeholder="Optional" />}</div>
    {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}
    <button type="submit" disabled={submit.isPending} className="button-primary w-fit disabled:cursor-wait disabled:opacity-60">{submit.isPending ? "Sending..." : short ? "Start a Conversation" : "Send Message"} <ArrowUpRight size={15} /></button>
    <p className="text-xs leading-5 text-slate-400">Submitting this form sends the message securely to the Zulubing inbox at development.zulubing@gmail.com.</p>
  </form>;
}

export function ContactPage() {
  return <><PageMeta title="Contact Zulubing" description="Tell Zulubing about your data, product, analytics, cloud, or AI challenge and connect with the team in New Delhi, India." path="/contact" /><PageHero eyebrow="08 / CONTACT" title="Let's Start a Conversation" description="Tell us about your data, product, analytics, cloud, or AI challenge and we’ll help clarify a useful next step."><a href="mailto:development.zulubing@gmail.com" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cobalt underline decoration-teal underline-offset-4"><Mail size={16} /> development.zulubing@gmail.com</a></PageHero><main className="bg-paper"><section className="py-20 md:py-28"><div className="container grid gap-14 lg:grid-cols-[0.65fr_1.35fr]"><div><SectionLabel index="01">START HERE</SectionLabel><h2 className="section-title mt-5">Bring us the hard part.</h2><p className="mt-5 text-base leading-8 text-slate-600">Whether you are modernizing a data platform, moving to the cloud, building analytics capabilities, preparing data for AI, or looking for structured learning and mentorship, a clear first conversation helps define the right path. Share what is changing, where the current approach is creating friction, and what a more useful outcome would look like.</p><div className="mt-10 grid gap-5 border-t border-slate-200 pt-5 text-sm"><a href="mailto:development.zulubing@gmail.com" className="flex items-start gap-3 hover:text-cobalt"><Mail size={16} className="mt-0.5 text-teal" /><span><strong className="block text-ink">Email</strong>development.zulubing@gmail.com</span></a><a href="tel:+918585904477" className="flex items-start gap-3 hover:text-cobalt"><Phone size={16} className="mt-0.5 text-teal" /><span><strong className="block text-ink">Phone</strong>+91 8585904477</span></a><div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-teal" /><span><strong className="block text-ink">Location</strong>New Delhi, India</span></div></div></div><div className="border border-slate-200 bg-white p-6 md:p-10"><SectionLabel index="02">PROJECT INTAKE</SectionLabel><h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Tell us what you're trying to solve.</h2><p className="mt-3 text-sm leading-7 text-slate-600">The more context you share, the more useful the first conversation can be. If you are enquiring about classes or mentorship, mention your current experience, preferred format, and the outcome you want to work toward.</p><div className="mt-9"><ContactForm /></div></div></div></section></main><ConnectPanel compact /></>;
}

export function TalkToExpertPage() {
  return <><PageMeta title="Talk to an Expert" description="Connect with Zulubing to discuss your data challenge, architecture, or transformation plan." path="/talk-to-an-expert" /><PageHero eyebrow="09 / EXPERT SESSION" title="Let's solve your data challenge." description="A focused first conversation about the architecture, technology, and delivery approach that fits your context."><div className="mt-6 flex flex-wrap gap-3"><a href="mailto:development.zulubing@gmail.com" className="text-link inline-flex">Email the team <ArrowRight size={15} /></a><span className="text-xs text-slate-400">or use the form below</span></div></PageHero><main className="bg-paper"><section className="py-20 md:py-28"><div className="container grid gap-14 lg:grid-cols-[0.8fr_1.2fr]"><div><SectionLabel index="01">A SHORTER PATH</SectionLabel><h2 className="section-title mt-5">Start with the signal, not the sales pitch.</h2><p className="mt-5 text-base leading-8 text-slate-600">Share the context you have. The goal is to identify the shape of the problem, the decisions in front of you, and the next useful step.</p><div className="mt-10 grid gap-3">{["Current challenge", "Decision you need to support", "Where time or trust is being lost", "What better looks like"].map((item, index) => <div key={item} className="flex gap-3 border-b border-slate-200 py-4"><span className="font-mono text-xs text-teal">0{index + 1}</span><span className="font-display text-lg font-semibold">{item}</span></div>)}</div><Link href="/engagement-models" className="text-link mt-8 inline-flex">See engagement models <ArrowRight size={15} /></Link></div><div className="border border-slate-200 bg-white p-6 md:p-10"><SectionLabel index="02">QUALIFICATION</SectionLabel><h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">A useful first step.</h2><p className="mt-3 text-sm leading-7 text-slate-600">Short form. Clear next action.</p><div className="mt-9"><ContactForm short kind="expert" /></div><div className="mt-8 border-t border-slate-200 pt-6"><span className="mono-label text-slate-400">ALTERNATE ROUTE</span><a href="mailto:development.zulubing@gmail.com?subject=Book%20a%20Consultation" className="text-link mt-3 inline-flex">Book a Consultation <ArrowUpRight size={15} /></a></div></div></div></section></main><ConnectPanel compact /></>;
}
