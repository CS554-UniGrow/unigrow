import { fetchRedis } from "@/helpers/redis";
import { options } from "../auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Message, messageValidator } from "@/lib/validations/message";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(options);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");

    if (
      session.user._id !== userId1 &&
      session.user._id !== userId2
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    const friendId = session.user._id === userId1 ? userId2 : userId1;

    const friendList = (await fetchRedis(
      "smembers",
      `user:${session.user._id}:friends`
    )) as string[];
    const isFriend = friendList.includes(friendId);

    if (!isFriend) {
      return new Response("Unauthorized", { status: 401 });
    }

    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user._id}`
    )) as string;
    const sender = JSON.parse(rawSender) as any;

    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      senderId: session.user._id,
      text,
      timestamp
    };

    const message = messageValidator.parse(messageData);

    // notify all connected chat room clients

    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming-message",
      message
    );

    await pusherServer.trigger(
      toPusherKey(`user:${friendId}:chats`),
      "new_message",
      {
        ...message,
        senderImg: sender.image,
        senderName: sender.name
      }
    );

    // all valid, send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message)
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
