import { auditSchema, type AuditOutput } from "./schema";
import { getPrisma } from "../../lib/prisma";
import { Resend } from "resend";
import type { AutomationResult, AutomationContext } from "../../core/types";
import { randomUUID } from "crypto";

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
    console.log('Processing audit submission for:', input.email);
    const prisma = getPrisma();
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 1. Save to Database
    console.log('Attempting DB Insert...');
    const submission = await prisma.auditSubmission.create({
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        company: input.company || null,
        website: input.website || null,
        industry: input.industry || null,
        teamSize: input.teamSize || null,
        
        // Formular fields
        whatYouSell: input.whatYouSell || null,
        typicalCustomer: input.typicalCustomer || null,
        customerSource: input.customerSource || null,
        founderTasks: input.founderTasks || null,
        magicWand: input.magicWand || null,
        marketingChallenge: input.marketingChallenge || null,
        salesTeam: input.salesTeam || null,
        salesChallenge: input.salesChallenge || null,
        deliveryBottleneck: input.deliveryBottleneck || null,
        recurringProblem: input.recurringProblem || null,
        supportHeadaches: input.supportHeadaches || null,
        aiExperience: input.aiExperience || null,
        aiToolsUsed: input.aiToolsUsed || null,
        successDefinition: input.successDefinition || null,
        specificFocus: input.specificFocus || null,

        // Audit fields
        processes: input.processes || [],
        topTool: input.topTool || null,
        acquisition: input.acquisition || null,
        salesProcess: input.salesProcess || null,
        marketingTeam: input.marketingTeam || null,
        primaryChannel: input.primaryChannel || null,
        crmSystem: input.crmSystem || null,
        adminTasks: input.adminTasks || null,
        automatedTasks: input.automatedTasks || null,
        supportProcess: input.supportProcess || null,
        expectations: input.expectations || null,
        priorities: input.priorities || null,
      },
    });

    // 2. Send Emails
    console.log('RESEND_API_KEY present:', !!process.env.RESEND_API_KEY);
    if (process.env.RESEND_API_KEY) {
      // Generate summary table only for provided fields
      const rows = Object.entries(input)
        .filter(([k, v]) => v != null && v !== "" && k !== 'name' && k !== 'email')
        .map(([k, v]) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; font-weight: bold; font-family: sans-serif; font-size: 14px; width: 30%; border-right: 1px solid #eee;">${k}</td>
            <td style="padding: 10px; font-family: sans-serif; font-size: 14px;">${Array.isArray(v) ? v.join(', ') : v}</td>
          </tr>
        `).join('');

      const tableHtml = `<table style="width: 100%; border: 1px solid #eee; border-collapse: collapse;">${rows}</table>`;

      try {
        console.log('Attempting to send internal notification email...');
        // Internal notification
        const internalRes = await resend.emails.send({
          from: 'System <notifier@arcigy.group>',
          to: ['branislav.laubert@gmail.com', 'hello@arcigy.group'],
          subject: `🚨 NOVÝ DOPYT (${input.name}): ${input.company || (input.website ? 'Web' : 'Neznámy')}`,
          html: `
            <div style="font-family: sans-serif; padding: 30px; background: #fff; color: #111; max-width: 800px; margin: 0 auto; border: 1px solid #eee;">
              <h1 style="border-bottom: 4px solid #7C3AED; padding-bottom: 15px; font-size: 24px;">PRÁVE PRIBUDOL NOVÝ DOPYT</h1>
              <p style="margin-bottom: 30px;">Odosielateľ: <strong>${input.name}</strong> (${input.email}).</p>
              
              <div style="background: #fdfdfd; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                ${tableHtml}
              </div>
            </div>
          `,
        });
        console.log('Internal email response:', internalRes);

        console.log('Attempting to send client confirmation email...');
        // Client confirmation
        const clientRes = await resend.emails.send({
          from: 'Arcigy Audit <audit@arcigy.group>',
          to: input.email,
          subject: 'Vaša žiadosť o AI Audit bola prijatá',
          html: `
            <div style="font-family: sans-serif; padding: 30px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #7C3AED;">Dobrý deň, ${input.name}.</h2>
              <p>Ďakujeme za váš záujem o AI Audit pre ${input.company || 'vašu firmu'}. Práve teraz analyzujeme vaše odpovede.</p>
              <p>Ozveme sa vám čoskoro s návrhom termínu.</p>
              <hr style="border: 0; border-top: 1px solid #EEE;" />
              <p style="font-size: 12px; color: #666;">Tím Arcigy</p>
            </div>
          `,
        });
        console.log('Client email response:', clientRes);
      } catch (e) {
        console.error('Email sending exception:', e);
      }
    } else {
      console.error('RESEND_API_KEY is not defined, skipping emails.');
    }

    return {
      success: true,
      data: { submissionId: submission.id },
      durationMs: Date.now() - ctx.startTime,
    };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Audit handler error:', errorMsg);
    return {
      success: false,
      error: errorMsg,
      durationMs: Date.now() - ctx.startTime,
    };
  }
}
