"use server";

import axios from "axios";

export const GENERATE_BKASH_TOKEN = async () => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_PGW_BKASH_GRANT_TOKEN_URL!,
    {
      app_key: process.env.NEXT_PUBLIC_PGW_BKASH_API_KEY,
      app_secret: process.env.NEXT_PUBLIC_PGW_BKASH_API_SECRET,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: process.env.NEXT_PUBLIC_PGW_BKASH_USERNAME,
        password: process.env.NEXT_PUBLIC_PGW_BKASH_PASSWORD,
      },
    }
  );

  return {
    success: true,
    token: res.data?.id_token,
  };
};

type CreatePaymentRegister = {
  token: string;
  scoutId: string;
  amount: number;
};
export const CREATE_PAYMENT = async ({
  token,
  scoutId,
  amount,
}: CreatePaymentRegister) => {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_PGW_BKASH_CREATE_PAYMENT_URL!,
    {
      mode: "0011",
      payerReference: " ",
      callbackURL: `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://apbn.vercel.app"
      }/api/payment/register/verify?token=${token}&scoutId=${scoutId}`,
      amount: amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber:
        "Inv" + Math.floor(100000 + Math.random() * 900000),
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.NEXT_PUBLIC_PGW_BKASH_API_KEY,
      },
    }
  );

  return {
    succes: true,
    url: res.data?.bkashURL,
  };
};
