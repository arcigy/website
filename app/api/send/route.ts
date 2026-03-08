import { Resend } from 'resend';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const formData = body;
    const name = formData.name || 'Neznáme meno';
    const email = formData.email || '';

    // 1. ULOŽENIE DO DATABÁZY (Postgres via Prisma)
    try {
      await prisma.auditSubmission.create({
        data: {
          name: formData.name || '',
          email: formData.email || '',
          phone: formData.phone || '',
          company: formData.company || '',
          industry: formData.industry || '',
          teamSize: formData.teamSize || '',
          whatYouSell: formData.whatYouSell || null,
          typicalCustomer: formData.typicalCustomer || null,
          customerSource: formData.customerSource || null,
          founderTasks: formData.founderTasks || null,
          magicWand: formData.magicWand || null,
          marketingChallenge: formData.marketingChallenge || null,
          salesTeam: formData.salesTeam || null,
          salesChallenge: formData.salesChallenge || null,
          deliveryBottleneck: formData.deliveryBottleneck || null,
          recurringProblem: formData.recurringProblem || null,
          supportHeadaches: formData.supportHeadaches || null,
          aiExperience: formData.aiExperience || null,
          aiToolsUsed: formData.aiToolsUsed || null,
          successDefinition: formData.successDefinition || null,
          specificFocus: formData.specificFocus || null,
        }
      });
      console.log('Submission saved to database successfully');
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Pokračujeme ďalej, aj keby DB zlyhala, aby aspoň email odišiel
    }

    // Mapa pre CELÉ znenie otázok (presne z formular/page.tsx)
    const fieldLabels: Record<string, string> = {
      name: 'Meno a priezvisko',
      email: 'Pracovný e-mail',
      phone: 'Telefónne číslo',
      company: 'Názov firmy',
      industry: 'Odvetvie',
      teamSize: 'Koľko ľudí pracuje vo firme?',
      whatYouSell: 'Jednou vetou, čo vaša firma predáva?',
      typicalCustomer: 'Kto je váš typický zákazník?',
      customerSource: 'Ako vás nájde väčšina zákazníkov?',
      founderTasks: 'Aké sú 3 hlavné úlohy, ktoré vám každý týždeň zaberajú najviac času?',
      magicWand: 'Keby ste mali čarovný prútik a získať späť 10 hodín týždenne, ktorú úlohu by ste zrušili prvú?',
      marketingChallenge: 'Akej najväčšej prekážke čelíte pri získavaní leadov?',
      salesTeam: 'Ako máte riešený obchodný tím?',
      salesChallenge: 'Aká je najväčšia výzva pri uzatváraní obchodov?',
      deliveryBottleneck: 'Čo je časovo najnáročnejšia časť procesu po tom, ako zákazník povie ÁNO?',
      recurringProblem: 'Je vo vašej operatíve niečo, čo sa neustále kazí?',
      supportHeadaches: 'Čo vám pri správe klientov spôsobuje najväčšie bolesti hlavy?',
      aiExperience: 'Skúšali ste už nejaké AI nástroje?',
      aiToolsUsed: 'Aké nástroje ste skúšali a aká bola skúsenosť?',
      successDefinition: 'Ak nájdeme pri audite pre vás to pravé, ako vyzerá úspech?',
      specificFocus: 'Mám sa počas auditu zamerať na niečo extrémne špecifické?',
    };

    let tableRows = '';
    let markdownContent = '';

    Object.entries(formData).forEach(([key, value]) => {
      if (['isSubmitting', 'isSuccess'].includes(key)) return;
      if (!value || (Array.isArray(value) && value.length === 0)) return;

      const label = fieldLabels[key] || key;
      const displayValue = Array.isArray(value) ? value.join(', ') : value;

      tableRows += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 15px 0; font-weight: bold; width: 40%; vertical-align: top; color: #111; font-size: 14px;">${label}</td>
          <td style="padding: 15px 0; vertical-align: top; color: #444; font-size: 14px;">${displayValue}</td>
        </tr>
      `;

      markdownContent += `### ${label}\n${displayValue}\n\n`;
    });

    const markdownVersion = `
# NOVÝ DOPYT NA AI AUDIT (${name})

${markdownContent}
    `.trim();

    const encodedData = Buffer.from(markdownVersion, 'utf-8').toString('base64');
    const copyLink = `https://website-production-7530.up.railway.app/formular/kopirovanie?data=${encodeURIComponent(encodedData)}`;

    // 1. INTERNÝ EMAIL (Pre tím Arcigy - hello@)
    await resend.emails.send({
      from: 'Arcigy Audit System <audit@arcigy.group>',
      to: ['hello@arcigy.group'],
      subject: `[ARCIGY-AUDIT-FORM] 🚨 NOVÝ DOPYT: ${name}`,
      html: `
        <div style="font-family: sans-serif; background: #FFFFFF; color: #111111; padding: 40px; line-height: 1.6; max-width: 800px; margin: 0 auto;">
          <h1 style="border-bottom: 4px solid #7C3AED; padding-bottom: 15px; font-size: 28px; letter-spacing: -1px; margin-bottom: 30px;">DOPYT NA AI AUDIT</h1>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${tableRows}
          </table>

          <div style="margin-top: 60px; background: #0D0010; padding: 40px; border-radius: 16px;">
            <table style="width: 100%; margin-bottom: 25px;">
              <tr>
                <td style="vertical-align: middle;">
                  <h3 style="font-size: 14px; margin: 0; color: #A855F7; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">Markdown pre CRM / Notion</h3>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                   <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${copyLink}" style="height:44px;v-text-anchor:middle;width:200px;" arcsize="15%" stroke="f" fillcolor="#7C3AED">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;">KOPÍROVAŤ CELÚ SPRÁVU</center>
                    </v:roundrect>
                  <![endif]-->
                  <a href="${copyLink}" style="background-color:#7C3AED;border-radius:6px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:44px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">KOPÍROVAŤ CELÚ SPRÁVU</a>
                </td>
              </tr>
            </table>
            
            <pre style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 25px; white-space: pre-wrap; font-size: 13px; color: #E2D9F3; border-radius: 12px; font-family: monospace;">${markdownVersion}</pre>
          </div>
          
          <p style="font-size: 12px; color: #999; margin-top: 50px; text-align: center; border-top: 1px solid #EEE; padding-top: 20px;">
            Vygenerované automaticky systémom Arcigy pre internú potrebu.
          </p>
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
