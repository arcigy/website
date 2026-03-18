import { handler as auditHandler } from "../../../automations/audit-submission/handler";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawData = await request.json();
    
    // Use the unified automation handler
    const result = await auditHandler(rawData);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        id: result.data?.submissionId 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Send Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error.' 
    }, { status: 500 });
  }
}
