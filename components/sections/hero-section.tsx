"use client";

import { Button } from "@/components/ui/button";
import { useData } from "@/lib/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const { data: heroData } = useData(
    "/api/pages/section?slug=home&sectionTitle=hero"
  );

  // Add safety checks before destructuring
  const properties = heroData?.properties || [];
  const [
    title = {},
    desc = {},
    btnText = {},
    rating = {},
    ratingText = {},
    imglink = {},
  ] = properties;

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {title?.value || "Default Title"}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {desc?.value || "Default description"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
              {btnText?.value || "Get Started"}
            </Button>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">
                {rating?.value || "4.9"}
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <div className="ml-2 text-sm text-gray-500">
                {ratingText?.value || "Customer Rating"}
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <Image
            src={imglink.value || "/placeholder.svg"}
            alt="AI voice agent for healthcare"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
