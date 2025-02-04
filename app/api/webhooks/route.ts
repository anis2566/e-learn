import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Knock } from "@knocklabs/node";
import { Role } from "@prisma/client";
import { fetchToken } from "@/lib/firebase";
const knock = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY);

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  if (eventType === "user.created") {
    await db.$transaction(async (ctx) => {
      const user = await ctx.user.create({
        data: {
          email: evt.data.email_addresses[0].email_address,
          name: `${evt.data.first_name} ${evt.data.last_name}`,
          clerkId: evt.data.id,
          imageUrl: evt.data.image_url,
        },
      });

      await clerkClient.users.updateUserMetadata(evt.data.id, {
        publicMetadata: {
          role: user.role,
        },
      });

      await knock.users.identify(user.id, {
        name: user.name,
        avatar: user.imageUrl,
      });
    });
  }

  if (eventType === "user.updated") {
    await db.$transaction(async (ctx) => {
      const user = await ctx.user.update({
        where: {
          clerkId: evt.data.id,
        },
        data: {
          email: evt.data.email_addresses[0].email_address,
          name: `${evt.data.first_name} ${evt.data.last_name}`,
          imageUrl: evt.data.image_url,
          role: (evt.data.public_metadata?.role as Role) || Role.User,
        },
      });
      await knock.users.identify(user.id, {
        name: user.name,
        avatar: user.imageUrl,
      });
    });
  }

  if (eventType === "user.deleted") {
    await db.$transaction(async (ctx) => {
      const user = await ctx.user.findUnique({
        where: {
          clerkId: evt.data.id,
        },
      });

      await knock.users.delete(user?.id || "");

      await db.user.delete({
        where: {
          clerkId: evt.data.id,
        },
      });
    });
  }

  if(eventType === "session.created") {
    const token = await fetchToken()
    await clerkClient.users.updateUser(evt.data.user_id, {
      privateMetadata: {
        fcmToken: token
      }
    })
  }

  return new Response("", { status: 200 });
}
