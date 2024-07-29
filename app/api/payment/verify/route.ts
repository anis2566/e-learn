import { NextRequest } from "next/server";

import axios from "axios";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const paymentID = searchParams.get("paymentID");
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");

  if (!userId || !courseId) redirect("/");

  const res = await axios.post(
    process.env.NEXT_PUBLIC_PGW_BKASH_EXECUTE_PAYMENT_URL!,
    { paymentID },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: token,
        "x-app-key": process.env.NEXT_PUBLIC_PGW_BKASH_API_KEY,
      },
    }
  );

  if (res.data && res.data?.statusCode === "0000") {
    await db.purchase.create({
      data: {
        courseId,
        userId,
      },
    });
    redirect(
      `/dashboard/payment/success?callback=/dashboard/courses/${courseId}`
    );
  } else {
    redirect("/dashboard/payment/failed");
  }
}
