'use server';

import { handler as auditHandler } from "../automations/audit-submission/handler";

export async function submitAudit(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      website: formData.get('website'),
      company: formData.get('company'),
      industry: formData.get('industry'),
      teamSize: formData.get('team_size'),
      processes: formData.getAll('processes'),
      topTool: formData.get('top_tool'),
      acquisition: formData.get('acquisition'),
      salesProcess: formData.get('sales_process'),
      marketingTeam: formData.get('marketing_team'),
      primaryChannel: formData.get('primary_channel'),
      crmSystem: formData.get('crm_system'),
      adminTasks: formData.get('admin_tasks'),
      automatedTasks: formData.get('automated_tasks'),
      supportProcess: formData.get('support_process'),
      expectations: formData.get('expectations'),
      priorities: formData.get('priorities'),
      
      // Fields from Formular
      whatYouSell: formData.get('whatYouSell'),
      typicalCustomer: formData.get('typicalCustomer'),
      customerSource: formData.get('customerSource'),
      founderTasks: formData.get('founderTasks'),
      magicWand: formData.get('magicWand'),
      marketingChallenge: formData.get('marketingChallenge'),
      salesTeam: formData.get('salesTeam'),
      salesChallenge: formData.get('salesChallenge'),
      deliveryBottleneck: formData.get('deliveryBottleneck'),
      recurringProblem: formData.get('recurringProblem'),
      supportHeadaches: formData.get('supportHeadaches'),
      aiExperience: formData.get('aiExperience'),
      aiToolsUsed: formData.get('aiToolsUsed'),
      successDefinition: formData.get('successDefinition'),
      specificFocus: formData.get('specificFocus'),
    };

    const result = await auditHandler(rawData);
    
    if (result.success) {
      return { success: true, id: result.data?.submissionId };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Submission error:', message);
    return { success: false, error: 'Internal server error.' };
  }
}
