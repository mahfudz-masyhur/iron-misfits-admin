"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export default function EditProductForm({
  id,
  name,
  image,
  price,
  category,
}: Props) {
  const [newName, setNewTitle] = useState(name);
  const [newImage, setNewImage] = useState(image);
  const [newPrice, setNewPrice] = useState<number>(price);
  const [newCategory, setNewCategory] = useState(category);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:4001/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newName, newImage, newPrice, newCategory }),
      });

      if (!res.ok) {
        throw new Error("Failed to update Product");
      }

      router.refresh();
      router.push("/products");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-bold py-10 text-2xl">Update Product</h1>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setNewTitle(e.target.value)}
          value={newName}
          className="input input-bordered input-accent w-full max-w-xs"
          type="text"
        />

        <input
          onChange={(e) => setNewImage(e.target.value)}
          value={newImage}
          className="input input-bordered input-accent w-full max-w-xs"
          type="text"
        />
        <input
          onChange={(e) => setNewPrice(Number(e.target.value))}
          value={newPrice}
          className="input input-bordered input-accent w-full max-w-xs"
          type="number"
        />
        <input
          onChange={(e) => setNewCategory(e.target.value)}
          value={newCategory}
          className="input input-bordered input-accent w-full max-w-xs"
          type="text"
        />

        <button className="btn btn-primary w-full max-w-xs">
          Update Product
        </button>
      </form>
    </>
  );
}
