import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, website, teamSize, processes, tool, acquisition, salesProcess, marketing, salesChannel, crm, painPoints, automateGoals, support, expectations, priorities } = body;

    const data = await resend.emails.send({
      from: 'Arcigy Audit <onboarding@resend.dev>', // Change this to your verified domain later
      to: ['hello@arcigy.group'],
      subject: `NOVÝ DOPYT NA AI AUDIT: ${name} (${teamSize})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #7C3AED;">Nový dopyt na AI Audit</h2>
          <hr style="border: 1px solid #7C3AED; margin-bottom: 20px;" />
          
          <h3>01. Základné informácie</h3>
          <p><strong>Meno:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefón:</strong> ${phone}</p>
          <p><strong>Web/LinkedIn:</strong> ${website}</p>
          <p><strong>Veľkosť tímu:</strong> ${teamSize}</p>

          <h3>02. Fungovanie</h3>
          <p><strong>Procesy:</strong> ${processes.join(', ')}</p>
          <p><strong>Najpoužívanejší nástroj:</strong> ${tool}</p>

          <h3>03. Obchod / Sales</h3>
          <p><strong>Akvizičné kanály:</strong> ${acquisition}</p>
          <p><strong>Proces sledovania:</strong> ${salesProcess}</p>
          <p><strong>Marketingový tím:</strong> ${marketing}</p>
          <p><strong>Sales kanál:</strong> ${salesChannel}</p>
          <p><strong>CRM:</strong> ${crm}</p>

          <h3>04. Operatíva & Support</h3>
          <p><strong>Najväčšie žrúty času:</strong> ${painPoints}</p>
          <p><strong>Ciele automatizácie:</strong> ${automateGoals}</p>
          <p><strong>Support proces:</strong> ${support}</p>

          <h3>05. Očakávania</h3>
          <p><strong>Čo očakávajú od AI:</strong> ${expectations}</p>
          <p><strong>Priority (12 mesiacov):</strong> ${priorities}</p>
        </div>
      `,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
