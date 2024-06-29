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

async function GETID(param: string) {
  const product = await User.findById(param);

  return { message: "Get Success", data: product };
}

async function PUT(param: string, req: NextApiRequest) {
  const product = req.body;
  const savedProduct = await User.findByIdAndUpdate(param, product);

  return { message: "Post Success", data: savedProduct };
}

async function DELETE(param: string, req: NextApiRequest) {
  const data = await User.findByIdAndDelete(param);

  return { message: "Delete Success", data };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const param = `${req.query.id}`;
    let data;
    await connectMongoDB();
    if (req.method === "GET") data = await GETID(param);
    if (req.method === "PUT") data = await PUT(param, req);
    if (req.method === "DELETE") data = await DELETE(param, req);

    if (!data) throw new Error("No data found");

    return res.json({ status: "ok", ...data });
  } catch (error: any) {
    return res
      .status(500)
      .json({ status: "error", message: error.message, error });
  }
}
