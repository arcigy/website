import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, email, phone, website, teamSize, processes, tool, 
      acquisition, salesProcess, marketing, salesChannel, crm, 
      painPoints, automateGoals, support, expectations, priorities 
    } = body;

    const markdownVersion = `
# AI AUDIT DOPYT: ${name}

## 01. ZÁKLADY
- **Meno a priezvisko:** ${name}
- **Email:** ${email}
- **Telefón:** ${phone}
- **Webstránka / LinkedIn firmy:** ${website}
- **Veľkosť spoločnosti/tímu:** ${teamSize}

## 02. AKTUÁLNE FUNGOVANIE
- **Vykonávané procesy:** ${processes.join(', ')}
- **Najpoužívanejší nástroj:** ${tool}

## 03. OBCHOD / SALES
- **Kde získavate potenciálnych klientov?:** ${acquisition}
- **Máte nastavený proces pre sledovanie obchodných príležitostí?:** ${salesProcess}

## 04. MARKETING
- **Máte dedikovaný marketingový tím?:** ${marketing}

## 05. PREDAJ
- **Aký je váš primárny kanál na získavanie zákazníkov?:** ${salesChannel}
- **Používate CRM? Ak áno, aké?:** ${crm}

## 06. ADMINISTRATÍVA / OPERATÍVA
- **Ktoré administratívne úlohy vám zaberajú najviac času?:** ${painPoints}
- **Aké rutinné činnosti by ste radi automatizovali?:** ${automateGoals}

## 07. PODPORA
- **Ako sa riešia požiadavky zákazníkov?:** ${support}

## 08. OČAKÁVANIA
- **Čo očakávate od implementácie AI?:** ${expectations}
- **Tri najdôležitejšie priority (12 mesiacov):** ${priorities}
    `.trim();

    // 1. INTERNÝ EMAIL (Pre tím Arcigy - hello@)
    await resend.emails.send({
      from: 'Arcigy Audit System <audit@arcigy.group>',
      to: ['hello@arcigy.group'],
      subject: `[ARCIGY-AUDIT-FORM] 🚨 NOVÝ DOPYT: ${name} (${teamSize})`,
      html: `
        <div style="font-family: sans-serif; background: #FFFFFF; color: #111111; padding: 40px; line-height: 1.6;">
          <h1 style="border-bottom: 2px solid #000000; padding-bottom: 10px; font-size: 22px;">NOVÝ DOPYT NA AI AUDIT</h1>
          
          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">01. Základné údaje</h2>
            <p><strong>Meno a priezvisko:</strong><br/>${name}</p>
            <p><strong>Váš email:</strong><br/>${email}</p>
            <p><strong>Váš telefón:</strong><br/>${phone}</p>
            <p><strong>Webstránka / LinkedIn firmy:</strong><br/>${website}</p>
            <p><strong>Aká je veľkosť vašej spoločnosti/tímu?:</strong><br/>${teamSize}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">02. Aktuálne fungovanie</h2>
            <p><strong>Ktoré z týchto procesov v súčasnosti vykonávate?:</strong><br/>${processes.join(', ')}</p>
            <p><strong>Ktorý nástroj používate vo firme najviac?:</strong><br/>${tool}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">03. Obchod / Sales</h2>
            <p><strong>Kde získavate potenciálnych klientov?:</strong><br/>${acquisition}</p>
            <p><strong>Máte nastavený proces pre sledovanie obchodných príležitostí?:</strong><br/>${salesProcess}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">04. Marketing</h2>
            <p><strong>Máte dedikovaný marketingový tím?:</strong><br/>${marketing}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">05. Predaj</h2>
            <p><strong>Aký je váš primárny kanál na získavanie zákazníkov?:</strong><br/>${salesChannel}</p>
            <p><strong>Používate CRM? Ak áno, aké?:</strong><br/>${crm}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">06. Administratíva / Operatíva</h2>
            <p><strong>Ktoré administratívne úlohy vám zaberajú najviac času?:</strong><br/>${painPoints}</p>
            <p><strong>Aké rutinné činnosti by ste radi automatizovali?:</strong><br/>${automateGoals}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">07. Podpora</h2>
            <p><strong>Ako sa riešia požiadavky zákazníkov?:</strong><br/>${support}</p>
          </div>

          <div style="margin-top: 30px;">
            <h2 style="font-size: 16px; text-transform: uppercase; border-bottom: 1px solid #EEE; padding-bottom: 5px;">08. Očakávania</h2>
            <p><strong>Čo očakávate od implementácie AI?:</strong><br/>${expectations}</p>
            <p><strong>Ktoré sú vaše tri najdôležitejšie priority pre nasledujúcich 12 mesiacov?:</strong><br/>${priorities}</p>
          </div>

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
            Ďakujeme za váš záujem o AI Audit pre firmu <strong>${website || 'vašu spoločnosť'}</strong>. Vaše odpovede sme úspešne prijali.
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
