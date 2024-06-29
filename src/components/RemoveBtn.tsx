"use client";

import { useRouter } from "next/navigation";

export default function RemoveBtn({ id }: { id: string }) {
  const router = useRouter();
  const removeProduct = async () => {
    const confirmed = confirm("Are you sure?");

    if (confirmed) {
      const res = await fetch(`http://localhost:4001/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <button onClick={removeProduct} className="btn btn-error ml-2">
      Delete
    </button>
  );
}
