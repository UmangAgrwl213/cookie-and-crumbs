"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
}

interface Address {
  id: string;
  name: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CheckoutStepperProps {
  steps: string[];
  currentStep: number;
  completedSteps: number[];
  cart: { items: CartItem[] };
  addresses: Address[];
}

export function CheckoutStepper({
  steps,
  currentStep,
  completedSteps,
  cart,
  addresses,
}: CheckoutStepperProps) {
  const [step, setStep] = useState(currentStep);

  const subtotalCents = cart.items.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0
  );
  const shippingCents = subtotalCents >= 5000 ? 0 : 600;
  const totalCents = subtotalCents + shippingCents;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  i < step && "bg-primary text-primary-foreground",
                  i === step && "bg-primary text-primary-foreground",
                  i > step && "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8",
                    i < step ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <h2 className="text-xl font-medium mb-4">Information</h2>
            <p className="text-muted-foreground">
              Enter your email and contact details.
            </p>
          </div>
        )}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-medium mb-4">Delivery</h2>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="font-medium">{addr.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {addr.line1}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                No saved addresses. Add one during checkout.
              </p>
            )}
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-medium mb-4">Payment</h2>
            <p className="text-muted-foreground">
              Stripe Payment Element will be rendered here.
            </p>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-medium mb-4">Review</h2>
            <p className="text-muted-foreground">
              Review your order before placing it.
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < steps.length - 1 && (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          )}
          {step === steps.length - 1 && <Button>Place Order</Button>}
        </div>
      </div>

      <aside className="rounded-xl border border-border p-6 h-fit">
        <h2 className="font-medium mb-4">Order Summary</h2>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.unitPriceCents * item.quantity / 100).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${(subtotalCents / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shippingCents === 0 ? "Free" : `$${(shippingCents / 100).toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${(totalCents / 100).toFixed(2)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
