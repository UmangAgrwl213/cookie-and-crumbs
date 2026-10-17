import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/clerk";
import { CheckoutStepper } from "@/components/molecules/CheckoutStepper";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");

  const [cart, addresses] = await Promise.all([
    prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true, variant: true } } },
    }),
    prisma.address.findMany({ where: { userId } }),
  ]);

  if (!cart || cart.items.length === 0) redirect("/cart");

  const checkoutCart = {
    items: cart.items.map((item) => ({
      id: item.id,
      name: item.product.name,
      quantity: item.quantity,
      unitPriceCents: item.variant?.priceCents ?? item.product.basePriceCents,
    })),
  };

  return (
    <div className="container-tight py-8">
      <h1 className="font-display text-3xl font-medium mb-8">Checkout</h1>
      <CheckoutStepper
        steps={["information", "delivery", "payment", "review"]}
        currentStep={0}
        completedSteps={[]}
        cart={checkoutCart}
        addresses={addresses}
      />
    </div>
  );
}
