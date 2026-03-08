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

    const data = await resend.emails.send({
      from: 'Arcigy Audit System <hello@arcigy.group>',
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

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
