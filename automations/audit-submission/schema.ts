import { z } from "zod";

export const auditSchema = z.object({
  name: z.string().min(2, "Meno je povinné"),
  email: z.string().email("Neplatný e-mail"),
  phone: z.string().min(6, "Telefón je povinný"),
  website: z.string().url("Neplatná URL").or(z.string().min(3)),
  company: z.string().optional(),
  industry: z.string().optional(),
  teamSize: z.string(),
  
  // From /formular (Step-by-step form)
  whatYouSell: z.string().optional(),
  typicalCustomer: z.string().optional(),
  customerSource: z.string().optional(),
  founderTasks: z.string().optional(),
  magicWand: z.string().optional(),
  marketingChallenge: z.string().optional(),
  salesTeam: z.string().optional(),
  salesChallenge: z.string().optional(),
  deliveryBottleneck: z.string().optional(),
  recurringProblem: z.string().optional(),
  supportHeadaches: z.string().optional(),
  aiExperience: z.string().optional(),
  aiToolsUsed: z.string().optional(),
  successDefinition: z.string().optional(),
  specificFocus: z.string().optional(),

  // From /audit (Single page form)
  processes: z.array(z.string()).optional(),
  topTool: z.string().optional(),
  acquisition: z.string().optional(),
  salesProcess: z.string().optional(),
  marketingTeam: z.string().optional(),
  primaryChannel: z.string().optional(),
  crmSystem: z.string().optional(),
  adminTasks: z.string().optional(),
  automatedTasks: z.string().optional(),
  supportProcess: z.string().optional(),
  expectations: z.string().optional(),
  priorities: z.string().optional(),
});

export type AuditInput = z.infer<typeof auditSchema>;
export type AuditOutput = { submissionId: string };
