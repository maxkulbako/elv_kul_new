import type { WayForPayFormParams } from "@/lib/actions/payments/wayforpay";

/**
 * Creates a hidden form with WayForPay parameters and submits it,
 * redirecting the user to the payment page.
 * @param params - Object containing WayForPay parameters.
 * @param paymentUrl - URL of the WayForPay payment page (default is production URL).
 */
export const redirectToWayForPay = (
  params: WayForPayFormParams,
  paymentUrl: string = process.env.WAYFORPAY_POST_URL ||
    "https://secure.wayforpay.com/pay/",
) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl;
  form.style.display = "none";

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key as keyof WayForPayFormParams];

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = `${key}[${index}]`;
          input.value = String(item);
          form.appendChild(input);
        });
      } else {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      }
    }
  }

  document.body.appendChild(form);
  form.submit();
};
