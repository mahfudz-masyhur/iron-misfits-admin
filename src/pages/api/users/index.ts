// pages/api/product.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "server/libs/mongodb";
import User from "server/models/User";
import { IUser } from "server/type/User";

type Data = {
  status: string;
  message: string;
  data?: IUser | IUser[] | null;
  error?: any;
};

async function GET() {
  const product = await User.find({});

  return { message: "Get Success", data: product };
}

async function POST(req: NextApiRequest) {
  const product = req.body;
  const savedProduct = await User.create(product);

  return { message: "Post Success", data: savedProduct };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    let data;
    await connectMongoDB();
    if (req.method === "GET") data = await GET();
    if (req.method === "POST") data = await POST(req);

    if (!data) throw new Error("No data found");

    return res.json({ status: "ok", ...data });
  } catch (error: any) {
    return res
      .status(500)
      .json({ status: "error", message: error.message, error });
  }
}
