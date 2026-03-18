import { z } from "zod";

export const auditSchema = z.object({
  name: z.string().min(1, "Meno je povinné"),
  email: z.string().email("Neplatný e-mail"),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  teamSize: z.string().optional().nullable(),
  
  // Fields from Formular (Step-by-step form)
  whatYouSell: z.string().optional().nullable(),
  typicalCustomer: z.string().optional().nullable(),
  customerSource: z.string().optional().nullable(),
  founderTasks: z.string().optional().nullable(),
  magicWand: z.string().optional().nullable(),
  marketingChallenge: z.string().optional().nullable(),
  salesTeam: z.string().optional().nullable(),
  salesChallenge: z.string().optional().nullable(),
  deliveryBottleneck: z.string().optional().nullable(),
  recurringProblem: z.string().optional().nullable(),
  supportHeadaches: z.string().optional().nullable(),
  aiExperience: z.string().optional().nullable(),
  aiToolsUsed: z.string().optional().nullable(),
  successDefinition: z.string().optional().nullable(),
  specificFocus: z.string().optional().nullable(),

  // Fields from Audit (Single page form)
  processes: z.array(z.string()).optional().nullable(),
  topTool: z.string().optional().nullable(),
  acquisition: z.string().optional().nullable(),
  salesProcess: z.string().optional().nullable(),
  marketingTeam: z.string().optional().nullable(),
  primaryChannel: z.string().optional().nullable(),
  crmSystem: z.string().optional().nullable(),
  adminTasks: z.string().optional().nullable(),
  automatedTasks: z.string().optional().nullable(),
  supportProcess: z.string().optional().nullable(),
  expectations: z.string().optional().nullable(),
  priorities: z.string().optional().nullable(),
}).passthrough(); // Allow unknown fields without error

export type AuditInput = z.infer<typeof auditSchema>;
export type AuditOutput = { submissionId: string };
