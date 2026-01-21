import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Placeholder response - AI integration coming soon
    const response = {
      type: "done",
      content: `Thank you for your message. The AI chat feature is coming soon!\n\nYour question: "${message}"\n\nIn the meantime, you can:\n- Browse available grants in the Grants section\n- Review compliance requirements\n- Contact our support team for assistance`,
      metadata: {}
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
