"use server";

import axios from "axios";
import { getUser } from "./user.service";

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

type CreatePayement = {
  token: string;
  amount: number;
  courseId: string;
};
export const CREATE_PAYMENT = async ({
  token,
  amount,
  courseId,
}: CreatePayement) => {
  const { userId } = await getUser();
  const res = await axios.post(
    process.env.NEXT_PUBLIC_PGW_BKASH_CREATE_PAYMENT_URL!,
    {
      mode: "0011",
      payerReference: " ",
      callbackURL: `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://e-learn-orpin.vercel.app"
      }/api/payment/verify?token=${token}&userId=${userId}&courseId=${courseId}`,
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
