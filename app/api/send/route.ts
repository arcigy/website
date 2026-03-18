import { handler as auditHandler } from "../../../automations/audit-submission/handler";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    console.log('Received Audit Submission via API:', rawData.email);
    
    // Use the unified automation handler
    const result = await auditHandler(rawData);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        id: result.data?.submissionId 
      });
    } else {
      console.error('Audit handler failed:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (error: any) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('API Send Endpoint Error:', msg);
    return NextResponse.json({ 
      success: false, 
      error: 'Požiadavku nebolo možné spracovať.' 
    }, { status: 500 });
  }
}
