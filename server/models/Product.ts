// server\models\Product.ts
import mongoose, { Model, Schema } from "mongoose";

import { IProduct } from "server/type/Product";

const topicSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", topicSchema);

export default Product;
