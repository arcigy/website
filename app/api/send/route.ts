import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = body;
    const name = formData.name || 'Neznáme meno';
    const email = formData.email || '';

    // Dynamicky vygenerujeme riadky pre tabuľku a markdown
    let tableRows = '';
    let markdownContent = '';

    // Mapa pre ľudskejšie názvy polí
    const fieldLabels: Record<string, string> = {
      name: 'Meno a priezvisko',
      email: 'Email',
      phone: 'Telefón',
      company: 'Firma',
      industry: 'Odvetvie',
      teamSize: 'Veľkosť tímu',
      whatYouSell: 'Čo firma predáva',
      typicalCustomer: 'Typický zákazník',
      customerSource: 'Zdroj zákazníkov',
      founderTasks: 'Hlavné úlohy zakladateľa',
      magicWand: 'Čarovný prútik (zrušenie úlohy)',
      marketingChallenge: 'Marketingová výzva',
      salesTeam: 'Obchodný tím',
      salesChallenge: 'Obchodná výzva',
      deliveryBottleneck: 'Úzke hrdlo v operatíve',
      recurringProblem: 'Opakujúci sa problém',
      supportHeadaches: 'Bolesti hlavy v podpore',
      aiExperience: 'Skúsenosti s AI',
      aiToolsUsed: 'Použité AI nástroje',
      successDefinition: 'Definícia úspechu',
      specificFocus: 'Špecifické zameranie',
      website: 'Webstránka / LinkedIn',
      processes: 'Vykonávané procesy',
      tool: 'Kľúčový nástroj',
      acquisition: 'Akvizícia klientov',
      salesProcess: 'Obchodný proces',
      marketing: 'Marketingový tím',
      salesChannel: 'Sales kanál',
      crm: 'CRM systém',
      painPoints: 'Administratívne pain points',
      automateGoals: 'Ciele automatizácie',
      support: 'Riešenie podpory',
      expectations: 'Očakávania od AI',
      priorities: 'Priority (12 mesiacov)',
    };

    Object.entries(formData).forEach(([key, value]) => {
      // Preskočíme technické polia alebo prázdne hodnoty
      if (['isSubmitting', 'isSuccess'].includes(key)) return;
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const label = fieldLabels[key] || key;
      const displayValue = Array.isArray(value) ? value.join(', ') : value;

      tableRows += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 12px 0; font-weight: bold; width: 35%; vertical-align: top; color: #666;">${label}</td>
          <td style="padding: 12px 0; vertical-align: top; color: #111;">${displayValue}</td>
        </tr>
      `;

      markdownContent += `- **${label}:** ${displayValue}\n`;
    });

    const markdownVersion = `
# NOVÝ DOPYT NA AI AUDIT (${name})

${markdownContent}
    `.trim();

    // 1. INTERNÝ EMAIL (Pre tím Arcigy - hello@)
    await resend.emails.send({
      from: 'Arcigy Audit System <audit@arcigy.group>',
      to: ['hello@arcigy.group'],
      subject: `[ARCIGY-AUDIT-FORM] 🚨 NOVÝ DOPYT: ${name}`,
      html: `
        <div style="font-family: sans-serif; background: #FFFFFF; color: #111111; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto;">
          <h1 style="border-bottom: 2px solid #000000; padding-bottom: 10px; font-size: 22px;">NOVÝ DOPYT NA AI AUDIT</h1>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            ${tableRows}
          </table>

          <div style="margin-top: 50px; background: #F9F9F9; padding: 25px; border: 1px solid #DDD;">
            <h3 style="font-size: 13px; margin-top: 0; color: #666;">MARKDOWN KÓPIA (pre CRM/Notion):</h3>
            <pre style="background: #FFF; border: 1px solid #CCC; padding: 15px; white-space: pre-wrap; font-size: 12px; color: #111;">${markdownVersion}</pre>
          </div>
        </div>
      `,
    });

    // 2. KLIENTSKÝ EMAIL (Potvrdenie pre zákazníka)
    const clientData = await resend.emails.send({
      from: 'Andrej z Arcigy <audit@arcigy.group>',
      to: [email],
      subject: `Ďakujeme za váš dopyt na AI Audit, ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; color: #111111; padding: 40px; border: 1px solid #EEE; border-radius: 8px;">
          <h2 style="color: #7C3AED; font-size: 24px; margin-bottom: 20px;">Dobrý deň, ${name}.</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Ďakujeme za váš záujem o AI Audit pre spoločnosť <strong>${formData.company || formData.website || 'vašu firmu'}</strong>. Vaše odpovede sme úspešne prijali.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Práve teraz analyzujeme vaše odpovede. Náš tím sa vám ozve čoskoro s návrhom termínu pre náš úvodný hovor, kde prejdeme všetky detaily a možnosti automatizácie.
          </p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Zatiaľ si môžete pozrieť naše riešenia na webe, aby ste videli, čo všetko dokážeme vo firmách zefektívniť.
          </p>
          <div style="text-align: center;">
            <a href="https://arcigy.group" style="display: inline-block; background: #7C3AED; color: #FFFFFF; padding: 16px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">SPÄŤ NA WEB</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #EEE; margin: 40px 0;" />
          <p style="font-size: 14px; color: #666; margin-bottom: 5px;">S pozdravom,</p>
          <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Tím Arcigy</p>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            Tento email bol odoslaný automaticky po vyplnení formulára na arcigy.group
          </p>
        </div>
      `,
    });

    return Response.json(clientData);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
