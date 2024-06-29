// pages/api/product.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectMongoDB from "server/libs/mongodb";
import Product from "server/models/Product";
import { IProduct } from "server/type/Product";

type Data = {
  status: string;
  message: string;
  data?: IProduct | IProduct[] | null;
  error?: any;
};

async function GET() {
  const product = await Product.find({});

  return { message: "Get Success", data: product };
}

async function PUT(req: NextApiRequest) {
  const product = req.body;
  const savedProduct = await Product.create(product);

  return { message: "Post Success", data: savedProduct };
}

async function POST(req: NextApiRequest) {
  const product = req.body;
  const savedProduct = await Product.create(product);

  return { message: "Post Success", data: savedProduct };
}

async function DELETE(req: NextApiRequest) {
  const data = await Product.findByIdAndDelete(req.query.id);

  return { message: "Delete Success", data };
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
    if (req.method === "PUT") data = await PUT(req);
    if (req.method === "DELETE") data = await DELETE(req);

    if (!data) throw new Error("No data found");

    return res.json({ status: "ok", ...data });
  } catch (error: any) {
    return res
      .status(500)
      .json({ status: "error", message: error.message, error });
  }
}
