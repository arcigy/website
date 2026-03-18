import { auditSchema, type AuditInput, type AuditOutput } from "./schema";
import { getPrisma } from "../../lib/prisma";
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
    const prisma = getPrisma();

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
      // Generate summary table
      const rows = Object.entries(input)
        .filter(([_, v]) => v != null && v !== "" && !(Array.isArray(v) && v.length === 0))
        .map(([k, v]) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold; font-family: sans-serif; font-size: 14px; width: 30%;">${k}</td>
            <td style="padding: 10px; font-family: sans-serif; font-size: 14px;">${Array.isArray(v) ? v.join(', ') : v}</td>
          </tr>
        `).join('');

      const tableHtml = `<table style="width: 100%; border-collapse: collapse;">${rows}</table>`;

      try {
        // Confirmation to client
        await resend.emails.send({
          from: 'Arcigy Audit <audit@arcigy.group>',
          to: input.email,
          subject: 'Potvrdenie prijatia vašej žiadosti o AI Audit',
          html: `
            <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #EEE; border-radius: 8px;">
              <h2 style="color: #7C3AED;">Dobrý deň, ${input.name}.</h2>
              <p>Ďakujeme za váš záujem o AI Audit pre spoločnosť <strong>${input.company || 'vašu firmu'}</strong>. Vaše údaje sme úspešne prijali a práve ich analyzujeme.</p>
              <p>Ozveme sa vám čoskoro s návrhom termínu úvodného hovoru.</p>
              <hr style="border: 0; border-top: 1px solid #EEE; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">Tím Arcigy</p>
            </div>
          `,
        });

        // Detailed notification to team
        await resend.emails.send({
          from: 'System <notifier@arcigy.group>',
          to: ['branislav.laubert@gmail.com', 'hello@arcigy.group'],
          subject: `🚨 NOVÝ DOPYT (${input.name}): ${input.company || (input.website ? 'Web' : 'Neznáme')}`,
          html: `
            <div style="font-family: sans-serif; padding: 30px; background: #fff; color: #111; max-width: 800px; margin: 0 auto;">
              <h1 style="border-bottom: 4px solid #7C3AED; padding-bottom: 15px; font-size: 24px;">NOVÝ DOPYT NA AI AUDIT</h1>
              <p style="margin-bottom: 30px;">Práve pribudol nový dopyt v databáze. Odosielateľ: <strong>${input.name}</strong> (${input.email}).</p>
              
              <div style="background: #fdfdfd; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                ${tableHtml}
              </div>
              
              <p style="margin-top: 40px; font-size: 11px; color: #999; text-align: center;">Vygenerované automaticky systémom Arcigy.</p>
            </div>
          `,
        });
      } catch (e) {
        console.error('Email sending failed in handler:', e);
      }
    }

    return {
      success: true,
      data: { submissionId: submission.id },
      durationMs: Date.now() - ctx.startTime,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: errorMessage,
      durationMs: Date.now() - ctx.startTime,
    };
  }
}
