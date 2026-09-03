/* Technical Editorial direction: coaching enrollment flows are warm, inviting, and student-friendly—clear field labels, structured course options, and encouraging next-step messaging. */
import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight, Check, Clock, GraduationCap, Mail, Phone, MapPin, Users, BookOpen, Star } from "lucide-react";
import { ConnectPanel, PageHero, PageMeta, SectionLabel, Breadcrumbs } from "@/components/SiteChrome";
import { trpc } from "@/lib/trpc";
import { coachingPrograms } from "@/lib/siteData";

const batchTimings = ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 3 PM)", "Evening (5 PM – 8 PM)", "Weekend (Sat & Sun)"];
const experienceLevels = ["Beginner — No prior experience", "Intermediate — Some familiarity", "Advanced — Looking to deepen skills"];
const referralSources = ["Google Search", "Social Media", "Friend / Family", "LinkedIn", "YouTube", "College / Institute", "Other"];

function Field({ label, name, type = "text", required = false, placeholder, children }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; children?: React.ReactNode }) {
  return <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}{required && <span className="ml-1 text-teal">*</span>}</span>{children ?? <input name={name} type={type} required={required} placeholder={placeholder} className="form-control" />}</label>;
}

export function StudentEnrollmentForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = trpc.coaching.enroll.useMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      await submit.mutateAsync({
        studentName: String(values.studentName ?? ""),
        dob: String(values.dob ?? ""),
        email: String(values.email ?? ""),
        phone: String(values.phone ?? ""),
        parentName: String(values.parentName ?? ""),
        schoolCollege: String(values.schoolCollege ?? ""),
        currentClass: String(values.currentClass ?? ""),
        course: String(values.course ?? ""),
        batchTiming: String(values.batchTiming ?? ""),
        experienceLevel: String(values.experienceLevel ?? ""),
        referralSource: String(values.referralSource ?? ""),
        additionalNotes: String(values.additionalNotes ?? ""),
        honeypot: String(values.honeypot ?? ""),
      });
      setSent(true);
      form.reset();
    } catch {
      setError("We could not deliver your enrollment right now. Please email development.zulubing@gmail.com directly.");
    }
  };

  if (sent) return <div className="border border-teal/40 bg-teal/10 p-8">
    <div className="flex h-10 w-10 items-center justify-center bg-teal text-ink"><Check size={20} /></div>
    <h3 className="mt-6 font-display text-2xl font-semibold">Thank you for enrolling with Zulubing Coaching.</h3>
    <p className="mt-3 max-w-md text-sm leading-7 text-slate-600">Our coaching team will review your application and reach out within 24–48 hours to confirm your seat and share the next steps.</p>
    <button type="button" onClick={() => setSent(false)} className="text-link mt-7">Submit another enrollment <ArrowRight size={15} /></button>
  </div>;

  return <form onSubmit={handleSubmit} className="grid gap-6">
    <label className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">Website<input name="honeypot" tabIndex={-1} autoComplete="off" /></label>

    {/* Student personal details */}
    <div className="grid gap-6 sm:grid-cols-2"><Field label="Student's full name" name="studentName" required placeholder="Full name" /><Field label="Date of birth" name="dob" type="date" required /></div>
    <div className="grid gap-6 sm:grid-cols-2"><Field label="Email address" name="email" type="email" required placeholder="student@email.com" /><Field label="Phone number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" /></div>
    <div className="grid gap-6 sm:grid-cols-2"><Field label="Parent / Guardian name" name="parentName" placeholder="Optional — for minor students" /><Field label="School / College name" name="schoolCollege" required placeholder="Institution name" /></div>

    {/* Academic & course details */}
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Current class / year" name="currentClass" required placeholder="e.g. 12th, B.Tech 2nd Year" />
      <Field label="Course" name="course" required><select name="course" required className="form-control"><option value="">Select a course</option>{coachingPrograms.map((program) => <option key={program.slug} value={program.title}>{program.title}</option>)}</select></Field>
    </div>

    {/* Preferences */}
    <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Preferred batch timing" name="batchTiming"><select name="batchTiming" className="form-control"><option value="">Select a timing</option>{batchTimings.map((timing) => <option key={timing} value={timing}>{timing}</option>)}</select></Field>
      <Field label="Prior experience level" name="experienceLevel"><select name="experienceLevel" className="form-control"><option value="">Select your level</option>{experienceLevels.map((level) => <option key={level} value={level}>{level}</option>)}</select></Field>
    </div>

    <Field label="How did you hear about us?" name="referralSource"><select name="referralSource" className="form-control"><option value="">Select an option</option>{referralSources.map((source) => <option key={source} value={source}>{source}</option>)}</select></Field>

    <Field label="Additional notes" name="additionalNotes" placeholder="Any specific goals, questions, or preferences?"><textarea name="additionalNotes" rows={4} placeholder="Any specific goals, questions, or preferences?" className="form-control resize-y" /></Field>

    {error && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">{error}</p>}
    <button type="submit" disabled={submit.isPending} className="button-primary w-fit disabled:cursor-wait disabled:opacity-60">{submit.isPending ? "Submitting..." : "Enroll Now"} <ArrowUpRight size={15} /></button>
    <p className="text-xs leading-5 text-slate-400">Submitting this form sends your enrollment details securely to the Zulubing coaching team at development.zulubing@gmail.com.</p>
  </form>;
}

export function CoachingPage() {
  return <>
    <PageMeta title="Coaching Programs — Zulubing" description="Enroll in Zulubing's industry-aligned coaching programs in Data Analytics, Data Engineering, MERN Stack, Full Stack Development, Agentic AI, and Machine Learning." path="/coaching" />
    <PageHero eyebrow="10 / COACHING" title="Learn with purpose. Build with confidence." description="Structured, mentor-led coaching programs designed to take you from fundamentals to job-ready skills in data, AI, and software development.">
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3"><Link href="/coaching#enroll" className="text-link inline-flex">Enroll now <ArrowRight size={15} /></Link><Link href="/coaching/seminars" className="text-link inline-flex">Upcoming seminars <ArrowRight size={15} /></Link></div>
    </PageHero>

    <main className="bg-paper">
      {/* Programs overview section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <SectionLabel index="01">PROGRAMS</SectionLabel>
          <h2 className="section-title mt-5">What you can learn with us.</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">Each program combines live instruction, hands-on projects, and 1-on-1 mentorship. Whether you are starting fresh or leveling up, there is a clear path forward.</p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coachingPrograms.map((program, index) => {
              const Icon = program.icon;
              return <Link key={program.slug} href={`/coaching/${program.slug}`} className="group relative border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-teal/50 hover:shadow-[0_8px_30px_rgba(17,196,194,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-teal/10 text-teal transition-colors duration-300 group-hover:bg-teal group-hover:text-ink"><Icon size={20} /></div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-[-0.02em] text-ink">{program.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{program.summary}</p>
                <div className="mt-5 flex flex-wrap gap-4 border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400"><Clock size={12} />{program.duration}</span>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400"><GraduationCap size={12} />{program.level}</span>
                </div>
                <span className="absolute bottom-6 right-6 text-teal opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1"><ArrowRight size={16} /></span>
              </Link>;
            })}
          </div>
        </div>
      </section>

      {/* Why Zulubing Coaching */}
      <section className="border-t border-slate-200 bg-[#f7faf9] py-20 md:py-28">
        <div className="container">
          <SectionLabel index="02">WHY ZULUBING</SectionLabel>
          <h2 className="section-title mt-5">Coaching that connects learning to real work.</h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: "Small Batch Sizes", desc: "Personalized attention with cohorts of 10–15 students." },
              { icon: BookOpen, title: "Project-Based Learning", desc: "Real-world projects that build your portfolio, not just theory." },
              { icon: Star, title: "Industry Mentors", desc: "Learn from engineers and analysts working in the field today." },
              { icon: GraduationCap, title: "Career Support", desc: "Resume reviews, mock interviews, and placement assistance." },
            ].map((item) => {
              const Icon = item.icon;
              return <div key={item.title} className="border-l-2 border-teal/40 pl-5">
                <Icon size={22} className="text-teal" />
                <h3 className="mt-4 font-display text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{item.desc}</p>
              </div>;
            })}
          </div>
        </div>
      </section>

      {/* Enrollment form section */}
      <section id="enroll" className="scroll-mt-24 py-20 md:py-28">
        <div className="container grid gap-14 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <SectionLabel index="03">ENROLL</SectionLabel>
            <h2 className="section-title mt-5">Start your journey here.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">Fill out the enrollment form with your details. Our team will review your application and get in touch within 24–48 hours to confirm your seat, discuss the syllabus, and answer any questions.</p>
            <div className="mt-10 grid gap-5 border-t border-slate-200 pt-5 text-sm">
              <a href="mailto:development.zulubing@gmail.com" className="flex items-start gap-3 hover:text-cobalt"><Mail size={16} className="mt-0.5 text-teal" /><span><strong className="block text-ink">Email</strong>development.zulubing@gmail.com</span></a>
              <a href="tel:+918585904477" className="flex items-start gap-3 hover:text-cobalt"><Phone size={16} className="mt-0.5 text-teal" /><span><strong className="block text-ink">Phone</strong>+91 8585904477</span></a>
              <div className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 text-teal" /><span><strong className="block text-ink">Location</strong>New Delhi, India</span></div>
            </div>
          </div>
          <div className="border border-slate-200 bg-white p-6 md:p-10">
            <SectionLabel index="04">STUDENT DETAILS</SectionLabel>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Tell us about yourself.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">The more context you share, the better we can match you to the right program, batch, and mentor.</p>
            <div className="mt-9"><StudentEnrollmentForm /></div>
          </div>
        </div>
      </section>
    </main>
    <ConnectPanel compact />
  </>;
}

export function CoachingDetailPage({ slug }: { slug: string }) {
  const program = coachingPrograms.find((p) => p.slug === slug);
  if (!program) return <div className="container py-40 text-center"><h1 className="font-display text-4xl font-semibold">Program not found</h1><Link href="/coaching" className="text-link mt-6 inline-flex">Back to Coaching <ArrowRight size={15} /></Link></div>;

  const Icon = program.icon;
  return <>
    <PageMeta title={`${program.title} — Zulubing Coaching`} description={program.description} path={`/coaching/${program.slug}`} />
    <section className="page-hero relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 bg-paper text-ink">
      <div className="container relative">
        <Breadcrumbs items={[{ label: "Coaching", href: "/coaching" }, { label: program.title }]} />
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_390px] lg:items-end">
          <div>
            <SectionLabel index={program.slug === "data-analytics" ? "01" : program.slug === "data-engineering" ? "02" : program.slug === "mern-stack" ? "03" : program.slug === "full-stack-development" ? "04" : program.slug === "agentic-ai" ? "05" : "06"}>PROGRAM</SectionLabel>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] md:text-7xl">{program.title}</h1>
          </div>
          <div>
            <p className="max-w-md text-base leading-8 text-slate-600">{program.description}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Clock size={15} className="text-teal" />{program.duration}</span>
              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500"><GraduationCap size={15} className="text-teal" />{program.level}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <main className="bg-paper">
      <section className="py-20 md:py-28">
        <div className="container grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel index="01">WHAT YOU'LL LEARN</SectionLabel>
            <h2 className="section-title mt-5">Curriculum highlights.</h2>
            <div className="mt-10 grid gap-3">
              {program.topics.map((topic, index) => <div key={topic} className="flex gap-3 border-b border-slate-200 py-4">
                <span className="font-mono text-xs text-teal">0{index + 1}</span>
                <span className="font-display text-lg font-semibold">{topic}</span>
              </div>)}
            </div>
            <Link href="/coaching#enroll" className="button-primary mt-10 inline-flex w-fit">Enroll in {program.title} <ArrowUpRight size={15} /></Link>
          </div>
          <div className="border border-slate-200 bg-white p-6 md:p-10">
            <SectionLabel index="02">QUICK ENROLL</SectionLabel>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-[-0.04em]">Reserve your seat.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Fill in your details and our team will reach out to confirm the next available batch.</p>
            <div className="mt-9"><StudentEnrollmentForm /></div>
          </div>
        </div>
      </section>
    </main>
    <ConnectPanel compact />
  </>;
}
