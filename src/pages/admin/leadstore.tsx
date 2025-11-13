import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Box } from "@/components/ui/box";

const LeadStore = () => {
  const services = [
    {
      name: "Expired Data",
      description: "Great for listing motivated sellers.",
      price: "50",
      period: "/per month",
    },
    {
      name: "Neighborhood Search",
      description: "Great for circle prospecting.",
      price: "49",
      period: "/per month",
    },
    {
      name: "FSBO",
      description: "Great for listing motivated sellers.",
      price: "36",
      period: "/per month",
    },
    {
      name: "FRBO",
      description: "Great for finding tired landlords.",
      price: "25",
      period: "/per month",
    },
    {
      name: "Skip Tracer",
      description: "Great for appending your address files.",
      price: "32",
      period: "/per month",
    },
  ];

  return (
    <Box className="min-h-screen pr-10">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Lead Store</h1>

      {/* Cards */}
      <div className="space-y-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {service.name}
                </h2>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>


            {/* Price + Button (LEFT ALIGNED) */}
            <div className="flex mt-3 flex-col items-start">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold text-gray-900">
                  <span className="text-2xl">$</span>
                  {service.price}
                </span>
                <span className="text-sm text-gray-500">{service.period}</span>
              </div>

              <Button className="bg-yellow-400 w-40 hover:bg-yellow-500 text-gray-900 rounded-md px-6 py-2 text-sm font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default LeadStore;
