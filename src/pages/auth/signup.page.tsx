import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    companyName: "",
    planId: "price_example_placeholder_id", // Replace with actual Stripe price ID
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST to backend to create Stripe Checkout Session
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-checkout-session`,
        formData
      );

      if (response.data.success && response.data.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.data.url;
      } else {
        toast.error("Failed to initialize checkout.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Start your free trial
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/admin/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="sr-only">Full Name</label>
              <Input
                name="fullName"
                type="text"
                required
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="sr-only">Email address</label>
              <Input
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="sr-only">Company Name (Optional)</label>
              <Input
                name="companyName"
                type="text"
                placeholder="Company Name (Optional)"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <Input
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Select Plan</label>
              <select
                name="planId"
                value={formData.planId}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                required
              >
                {/* Replace these values with your actual Stripe Price IDs */}
                <option value="price_example_placeholder_id_1">Starter Plan - $49/mo</option>
                <option value="price_example_placeholder_id_2">Pro Plan - $99/mo</option>
                <option value="price_example_placeholder_id_3">Enterprise - Custom</option>
              </select>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md"
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
