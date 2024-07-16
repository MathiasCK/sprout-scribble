"use client";

import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useCart } from "~/hooks";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { createPaymentIntent } from "~/server/actions";

const PaymentForm = ({ totalPrice }: { totalPrice: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }

    const { data } = await createPaymentIntent({
      amount: totalPrice,
      currency: "usd",
      cart: cart.map(item => ({
        quantity: item.variant.quantity,
        productId: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });

    if (data?.error || !data?.success) {
      setErrorMessage(
        data?.error ?? '"An error occuerd whilst processing payment"'
      );
      setIsLoading(false);
      return;
    }

    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      clientSecret: data.success.clientSecretId!,
      redirect: "if_required",
      confirmParams: {
        return_url: "http://localhost:3000/success",
        receipt_email: data.success.user!,
      },
    });

    if (paymentError) {
      setErrorMessage(paymentError.message!);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        className="my-4 w-full"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
};

export default PaymentForm;
