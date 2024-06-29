"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "server/axios";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Name and image are required.");
      return;
    }

    try {
      const res = await axios.post("/api/products", {
        name,
        image,
        price,
        category,
      });

      router.push("/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-bold py-10 text-2xl">Add New Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="input input-bordered input-accent w-full max-w-xs"
          type="text"
          placeholder="Product Name"
        />

        <input
          onChange={(e) => setImage(e.target.value)}
          value={image}
          className="input input-bordered input-accent w-full max-w-xs"
          type="text"
          placeholder="/images/1.jpg"
          defaultValue="/images/1.jpg"
        />
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          className="input input-bordered input-accent w-full max-w-xs"
          type="number"
          placeholder="1"
          defaultValue="1"
        />
        <input
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          className="input input-bordered input-accent w-full max-w-xs"
          type="text"
          placeholder="Product Category"
        />

        <button type="submit" className="btn btn-primary w-full max-w-xs">
          Add Product
        </button>
      </form>
    </>
  );
}
