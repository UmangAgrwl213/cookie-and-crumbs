import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/clerk";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="container-tight py-16">
      <h1 className="font-display text-3xl font-medium mb-8">Your Account</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">You haven&rsquo;t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border p-4">
              <div className="flex justify-between">
                <span className="font-medium">Order {order.orderNumber}</span>
                <span className="text-sm text-muted-foreground">{order.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ${(order.totalCents / 100).toFixed(2)} — {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
