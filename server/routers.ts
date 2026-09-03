import { COOKIE_NAME, CURRENT_WORKSHOP } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendGmailMessage } from "./gmailApi";
import { saveCoachingEnrollment, saveContactSubmission, saveWorkshopEnrollment } from "./db";


const formSubmissionSchema = z.object({
  kind: z.enum(["contact", "expert", "careers"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  company: z.string().trim().max(160).optional().default(""),
  title: z.string().trim().max(160).optional().default(""),
  country: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(80).optional().default(""),
  service: z.string().trim().max(160).optional().default(""),
  platform: z.string().trim().max(240).optional().default(""),
  description: z.string().trim().max(5000).optional().default(""),
  timeline: z.string().trim().max(120).optional().default(""),
  additional: z.string().trim().max(3000).optional().default(""),
  honeypot: z.string().max(200).optional().default(""),
});

const studentEnrollmentSchema = z.object({
  studentName: z.string().trim().min(2).max(120),
  dob: z.string().trim().min(1).max(20),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(80).optional().default(""),
  parentName: z.string().trim().max(120).optional().default(""),
  schoolCollege: z.string().trim().min(2).max(200),
  currentClass: z.string().trim().min(1).max(100),
  course: z.string().trim().min(1).max(160),
  batchTiming: z.string().trim().max(120).optional().default(""),
  experienceLevel: z.string().trim().max(120).optional().default(""),
  referralSource: z.string().trim().max(120).optional().default(""),
  additionalNotes: z.string().trim().max(3000).optional().default(""),
  honeypot: z.string().max(200).optional().default(""),
});

const workshopEnrollmentSchema = z.object({
  studentName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().max(80).optional().default(""),
  jobReadyInterest: z.boolean().optional().default(false),
  honeypot: z.string().max(200).optional().default(""),
});

type FormSubmission = z.infer<typeof formSubmissionSchema>;
type StudentEnrollment = z.infer<typeof studentEnrollmentSchema>;
type WorkshopEnrollment = z.infer<typeof workshopEnrollmentSchema>;

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  "\"": "&quot;",
}[character] ?? character));

const labelMap: Record<keyof FormSubmission, string> = {
  kind: "Form",
  name: "Name",
  email: "Email",
  company: "Company",
  title: "Job title",
  country: "Country",
  phone: "Phone",
  service: "Service",
  platform: "Current platform",
  description: "Description",
  timeline: "Timeline",
  additional: "Additional information",
  honeypot: "",
};

const workshopLabelMap: Record<keyof WorkshopEnrollment, string> = {
  studentName: "Name",
  email: "Email",
  phone: "Phone",
  jobReadyInterest: "Interested in job-ready live sessions",
  honeypot: "",
};

const studentLabelMap: Record<keyof StudentEnrollment, string> = {
  studentName: "Student Name",
  dob: "Date of Birth",
  email: "Email",
  phone: "Phone",
  parentName: "Parent / Guardian",
  schoolCollege: "School / College",
  currentClass: "Current Class / Year",
  course: "Course",
  batchTiming: "Preferred Batch Timing",
  experienceLevel: "Experience Level",
  referralSource: "How they heard about us",
  additionalNotes: "Additional Notes",
  honeypot: "",
};

async function sendFormNotification(input: FormSubmission) {
  const rows = (Object.keys(labelMap) as Array<keyof FormSubmission>)
    .filter((key) => key !== "honeypot" && key !== "kind" && Boolean(input[key]))
    .map((key) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5ece9;font-weight:600;color:#52615e">${labelMap[key]}</td><td style="padding:8px 12px;border-bottom:1px solid #e5ece9">${escapeHtml(String(input[key]))}</td></tr>`)
    .join("");
  const subject = `[Zulubing] ${input.kind === "careers" ? "Careers enquiry" : input.kind === "expert" ? "Expert session request" : "New project enquiry"} from ${input.name}`;

  try {
    await sendGmailMessage({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: input.email,
      subject,
      html: `<div style="font-family:Arial,sans-serif;color:#08131f"><h2>Zulubing form submission</h2><p>A visitor submitted the ${escapeHtml(input.kind)} form.</p><table style="border-collapse:collapse;width:100%;max-width:720px">${rows}</table></div>`,
      text: `Zulubing ${input.kind} submission from ${input.name}. Reply to ${input.email}.`,
    });
  } catch (error) {
    console.error("[Email] Gmail API delivery failed", error instanceof Error ? error.message : "unknown error");
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not deliver your message right now. Please email development.zulubing@gmail.com directly." });
  }
}

async function sendStudentEnrollmentNotification(input: StudentEnrollment) {
  const rows = (Object.keys(studentLabelMap) as Array<keyof StudentEnrollment>)
    .filter((key) => key !== "honeypot" && Boolean(input[key]))
    .map((key) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5ece9;font-weight:600;color:#52615e">${studentLabelMap[key]}</td><td style="padding:8px 12px;border-bottom:1px solid #e5ece9">${escapeHtml(String(input[key]))}</td></tr>`)
    .join("");
  const subject = `[Zulubing] New coaching enrollment from ${input.studentName} — ${input.course}`;

  try {
    await sendGmailMessage({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: input.email,
      subject,
      html: `<div style="font-family:Arial,sans-serif;color:#08131f"><h2 style="color:#11c4c2">🎓 New Coaching Enrollment</h2><p>A student has enrolled for <strong>${escapeHtml(input.course)}</strong> via the Zulubing Coaching form.</p><table style="border-collapse:collapse;width:100%;max-width:720px">${rows}</table><br/><p style="color:#52615e;font-size:13px">This enrollment was submitted from the Zulubing website coaching form.</p></div>`,
      text: `Zulubing coaching enrollment from ${input.studentName} for ${input.course}. Reply to ${input.email}.`,
    });
  } catch (error) {
    console.error("[Email] Gmail API delivery failed for coaching enrollment", error instanceof Error ? error.message : "unknown error");
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not deliver your enrollment right now. Please email development.zulubing@gmail.com directly." });
  }
}

async function sendWorkshopEnrollmentNotification(input: WorkshopEnrollment) {
  const display = (key: keyof WorkshopEnrollment) =>
    typeof input[key] === "boolean" ? (input[key] ? "Yes" : "No") : String(input[key]);
  const rows = (Object.keys(workshopLabelMap) as Array<keyof WorkshopEnrollment>)
    .filter((key) => key !== "honeypot" && (typeof input[key] === "boolean" || Boolean(input[key])))
    .map((key) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5ece9;font-weight:600;color:#52615e">${workshopLabelMap[key]}</td><td style="padding:8px 12px;border-bottom:1px solid #e5ece9">${escapeHtml(display(key))}</td></tr>`)
    .join("");
  const subject = `[Zulubing] ${CURRENT_WORKSHOP} registration from ${input.studentName}`;

  try {
    await sendGmailMessage({
      from: "Zulubing Website <development.zulubing@gmail.com>",
      to: "development.zulubing@gmail.com",
      replyTo: input.email,
      subject,
      html: `<div style="font-family:Arial,sans-serif;color:#08131f"><h2 style="color:#11c4c2">📅 New Workshop Registration</h2><p>A new registration came in for <strong>${escapeHtml(CURRENT_WORKSHOP)}</strong>.</p><table style="border-collapse:collapse;width:100%;max-width:720px">${rows}</table><br/><p style="color:#52615e;font-size:13px">Submitted from the Zulubing website workshop registration form.</p></div>`,
      text: `${CURRENT_WORKSHOP} registration from ${input.studentName}. Job-ready sessions: ${input.jobReadyInterest ? "Yes" : "No"}. Reply to ${input.email}.`,
    });
  } catch (error) {
    console.error("[Email] Gmail API delivery failed for workshop registration", error instanceof Error ? error.message : "unknown error");
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "We could not deliver your registration right now. Please email development.zulubing@gmail.com directly." });
  }
}

const submitForm = publicProcedure.input(formSubmissionSchema).mutation(async ({ input }) => {
  if (input.honeypot.trim()) return { success: true } as const;

  try {
    await saveContactSubmission({
      kind: input.kind,
      name: input.name,
      email: input.email,
      company: input.company || "",
      title: input.title || "",
      country: input.country || "",
      phone: input.phone || "",
      service: input.service || "",
      platform: input.platform || "",
      description: input.description || "",
      timeline: input.timeline || "",
      additional: input.additional || "",
    });
  } catch (dbErr) {
    console.error("[Database] Failed to save contact submission:", dbErr);
  }

  await sendFormNotification(input);
  return { success: true } as const;
});

const submitEnrollment = publicProcedure.input(studentEnrollmentSchema).mutation(async ({ input }) => {
  if (input.honeypot.trim()) return { success: true } as const;

  try {
    await saveCoachingEnrollment({
      studentName: input.studentName,
      dob: input.dob,
      email: input.email,
      phone: input.phone || "",
      parentName: input.parentName || "",
      schoolCollege: input.schoolCollege || "",
      currentClass: input.currentClass || "",
      course: input.course,
      batchTiming: input.batchTiming || "",
      experienceLevel: input.experienceLevel || "",
      referralSource: input.referralSource || "",
      additionalNotes: input.additionalNotes || "",
    });
  } catch (dbErr) {
    console.error("[Database] Failed to save coaching enrollment:", dbErr);
  }

  await sendStudentEnrollmentNotification(input);
  return { success: true } as const;
});

const submitWorkshopEnrollment = publicProcedure.input(workshopEnrollmentSchema).mutation(async ({ input }) => {
  if (input.honeypot.trim()) return { success: true } as const;

  try {
    await saveWorkshopEnrollment({
      studentName: input.studentName,
      email: input.email,
      phone: input.phone || "",
      seminar: CURRENT_WORKSHOP,
      jobReadyInterest: input.jobReadyInterest,
    });
  } catch (dbErr) {
    console.error("[Database] Failed to save workshop enrollment:", dbErr);
  }

  await sendWorkshopEnrollmentNotification(input);
  return { success: true } as const;
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  contact: router({
    submit: submitForm,
  }),
  coaching: router({
    enroll: submitEnrollment,
  }),
  workshops: router({
    enroll: submitWorkshopEnrollment,
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

