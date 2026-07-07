import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAppDispatch } from "@/store/hooks";
import { createCardSetupIntent, updateCardPaymentMethod, fetchCurrentCard, type CardSummary } from "@/store/slices/subscriptionSlice";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export interface ChangeCardTarget {
  userId: string;
  fullName?: string | null;
  cardBrand?: string | null;
  cardLast4?: string | null;
}

interface ChangeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: ChangeCardTarget | null;
  onSuccess: () => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: "15px",
      color: "#111",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#EF4444" },
  },
};

const ChangeCardForm = ({ target, onClose, onSuccess }: Omit<ChangeCardModalProps, "isOpen">) => {
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardSummary | null>(null);
  const [loadingCurrentCard, setLoadingCurrentCard] = useState(true);

  useEffect(() => {
    if (!target) return;
    setLoadingSecret(true);
    setClientSecret(null);

    dispatch(createCardSetupIntent(target.userId))
      .then((result: any) => {
        if (createCardSetupIntent.fulfilled.match(result)) {
          setClientSecret(result.payload);
        } else {
          toast.error((result.payload as string) || "Failed to start card setup");
        }
      })
      .finally(() => setLoadingSecret(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.userId]);

  useEffect(() => {
    if (!target) return;
    setLoadingCurrentCard(true);
    setCurrentCard(null);

    // The list-view card fields can be stale/empty (older subscriptions never
    // had cardBrand/cardLast4 written locally) — resolve live from Stripe.
    dispatch(fetchCurrentCard(target.userId))
      .then((result: any) => {
        if (fetchCurrentCard.fulfilled.match(result)) {
          setCurrentCard(result.payload.card);
        }
      })
      .finally(() => setLoadingCurrentCard(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.userId]);

  const handleConfirm = async () => {
    if (!stripe || !elements || !clientSecret || !target) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setSubmitting(true);
    try {
      const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(error.message || "Card could not be verified");
        return;
      }

      const paymentMethodId =
        typeof setupIntent?.payment_method === "string"
          ? setupIntent.payment_method
          : setupIntent?.payment_method?.id;

      if (!paymentMethodId) {
        toast.error("Could not resolve the new payment method");
        return;
      }

      const result = await dispatch(
        updateCardPaymentMethod({ userId: target.userId, paymentMethodId }),
      );

      if (updateCardPaymentMethod.fulfilled.match(result)) {
        toast.success("Card updated — future charges will use the new card");
        onSuccess();
        onClose();
      } else {
        toast.error((result.payload as string) || "Failed to update card");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayCard = currentCard ?? {
    brand: target?.cardBrand ?? null,
    last4: target?.cardLast4 ?? null,
    expMonth: null,
    expYear: null,
  };
  const hasCurrentCard = displayCard.brand && displayCard.last4;

  return (
    <>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-3">
          <span className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">User</span>
          <span className="text-[#111] dark:text-white text-[15px]">
            {target?.fullName || target?.userId}
          </span>
        </div>

        <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-3">
          <span className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Current Card</span>
          <span className="text-[#111] dark:text-white text-[15px] font-[500]">
            {loadingCurrentCard ? (
              <span className="text-gray-400 font-normal">Checking Stripe…</span>
            ) : hasCurrentCard ? (
              `${displayCard.brand!.toUpperCase()} •••• ${displayCard.last4}`
            ) : (
              "No card on file"
            )}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500] px-1">New Card Details</span>
          <div className="bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-3">
            {loadingSecret ? (
              <span className="text-[13px] text-gray-400">Preparing secure card form…</span>
            ) : clientSecret ? (
              <CardElement options={cardElementOptions} />
            ) : (
              <span className="text-[13px] text-red-500">Could not start card setup. Close and try again.</span>
            )}
          </div>
        </div>

        <p className="text-[12px] text-gray-400 px-1">
          Card details are sent directly to Stripe and never stored on our servers.
        </p>
      </div>

      <div className="px-6 py-5 flex gap-3 border-t border-gray-100 dark:border-slate-700">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] py-3 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={submitting || !stripe || !clientSecret}
          className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors flex items-center justify-center disabled:opacity-50"
        >
          {submitting ? "Updating…" : "Update Card"}
        </button>
      </div>
    </>
  );
};

const ChangeCardModal = ({ isOpen, onClose, target, onSuccess }: ChangeCardModalProps) => {
  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[420px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">Change Card</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <ChangeCardForm target={target} onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
};

export default ChangeCardModal;
