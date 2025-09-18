import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const BuyNow = () => {
  const location = useLocation();
  const { product } = location.state || {}; // get product from navigation state

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  console.log(formData)

  const handleConfirm = () => {
    if (!formData.name || !formData.address || !formData.phone) {
      alert("Please fill all details before confirming!");
      return;
    }
    alert(`✅ Order Confirmed!\n\nProduct: ${product?.name}\nName: ${formData.name}`);
  };

  if (!product) {
    return <p className="p-6">No product selected. Go back to products page.</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto shadow-lg rounded-2xl bg-white mt-14">
      <h2 className="text-2xl font-bold mb-4">Confirm Your Order</h2>

      {/* Product Details */}
      <div className="border rounded-lg p-4 mb-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p>Price: ${product.price}</p>
      </div>

      {/* User Form */}
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirm}
        className="mt-5 w-full bg-green-600 text-white p-3 rounded-xl font-bold hover:bg-green-700"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default BuyNow;
