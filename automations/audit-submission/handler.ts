import { auditSchema, type AuditInput, type AuditOutput } from "./schema";
import { prisma } from "../../lib/prisma";
import { Resend } from "resend";
import type { AutomationResult, AutomationContext } from "../../core/types";
import { randomUUID } from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(
  rawInput: unknown
): Promise<AutomationResult<AuditOutput>> {
  const ctx: AutomationContext = {
    automationName: "audit-submission",
    runId: randomUUID(),
    startTime: Date.now(),
  };

  try {
    const input = auditSchema.parse(rawInput);

    // 1. Save to Database
    const submission = await prisma.auditSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        company: input.company,
        website: input.website,
        industry: input.industry,
        teamSize: input.teamSize,
        
        // Formular fields
        whatYouSell: input.whatYouSell,
        typicalCustomer: input.typicalCustomer,
        customerSource: input.customerSource,
        founderTasks: input.founderTasks,
        magicWand: input.magicWand,
        marketingChallenge: input.marketingChallenge,
        salesTeam: input.salesTeam,
        salesChallenge: input.salesChallenge,
        deliveryBottleneck: input.deliveryBottleneck,
        recurringProblem: input.recurringProblem,
        supportHeadaches: input.supportHeadaches,
        aiExperience: input.aiExperience,
        aiToolsUsed: input.aiToolsUsed,
        successDefinition: input.successDefinition,
        specificFocus: input.specificFocus,

        // Audit fields
        processes: input.processes || [],
        topTool: input.topTool,
        acquisition: input.acquisition,
        salesProcess: input.salesProcess,
        marketingTeam: input.marketingTeam,
        primaryChannel: input.primaryChannel,
        crmSystem: input.crmSystem,
        adminTasks: input.adminTasks,
        automatedTasks: input.automatedTasks,
        supportProcess: input.supportProcess,
        expectations: input.expectations,
        priorities: input.priorities,
      },
    });

    // 2. Send Emails
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Arcigy Audit <audit@arcigy.group>',
          to: input.email,
          subject: 'Potvrdenie prijatia vašej žiadosti o AI Audit',
          html: `<p>Dobrý deň ${input.name},</p><p>Ďakujeme za záujem o AI Audit pre ${input.company || 'vašu firmu'}.</p>`,
        });

        await resend.emails.send({
          from: 'System <notifier@arcigy.group>',
          to: 'branislav.laubert@gmail.com',
          subject: `Nový AI Audit dopyt: ${input.name}`,
          html: `<p>Nová žiadosť od ${input.name} (${input.email}).</p>`,
        });
      } catch (e) {
        console.error('Email send error:', e);
      }
    }

    return {
      success: true,
      data: { submissionId: submission.id },
      durationMs: Date.now() - ctx.startTime,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      durationMs: Date.now() - ctx.startTime,
    };
  }
}
