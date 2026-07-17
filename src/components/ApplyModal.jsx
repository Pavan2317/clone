import React, { useState } from "react";

const ApplyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: only numbers
    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let newErrors = {};

    // Full Name (only alphabets and spaces)
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
      newErrors.fullName =
        "Only alphabets and spaces are allowed";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    // Resume URL
    if (!formData.resume.trim()) {
      newErrors.resume = "Resume link is required";
    } else {
      try {
        new URL(formData.resume);
      } catch {
        newErrors.resume = "Enter a valid URL";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit(formData);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      resume: "",
    });

    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-[400px] max-w-[90%]">
        <h2 className="text-2xl font-bold mb-4">
          Apply for Job
        </h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mb-3">
            {errors.fullName}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">
            {errors.email}
          </p>
        )}

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mb-3">
            {errors.phone}
          </p>
        )}

        <input
          type="text"
          name="resume"
          placeholder="Resume Link"
          value={formData.resume}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        {errors.resume && (
          <p className="text-red-500 text-sm mb-4">
            {errors.resume}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;