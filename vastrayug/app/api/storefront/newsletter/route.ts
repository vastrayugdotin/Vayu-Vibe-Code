import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

/**
 * POST /api/storefront/newsletter
 * Subscribe to the cosmic circle.
 * Reference: docs/prompt.md Step 4.7
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with Zod as per Step 4.7
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error.errors[0].message },
        { status: 400 },
      );
    }

    const { email, source } = result.data;

    // Check if already exists (Upsert behavior: return 200 if already exists)
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          success: true,
          message: "You are already aligned with our cosmic circle.",
        });
      } else {
        // Re-activate if they had unsubscribed
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, subscribedAt: new Date() },
        });
      }
    } else {
      // Create new subscriber
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          source: source || "footer",
        },
      });
    }

    // Note: SendGrid "Welcome" email trigger belongs to Phase 2

    return NextResponse.json({
      success: true,
      message: "Alignment complete. Welcome to the universe.",
    });
  } catch (error) {
    console.error("Newsletter API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
