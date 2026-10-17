import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/schemas/order";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      id: true,
      email: true,
      name: true,
      dietaryPreferences: true,
      marketingOptIn: true,
      defaultAddressId: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Profile not found" } }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid profile update", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { clerkId: userId },
    data: parsed.data,
    select: { id: true, email: true, name: true, dietaryPreferences: true, marketingOptIn: true },
  });
  return NextResponse.json(updated);
}