import Image from "next/image"
import { cn } from "@/lib/utils"

interface FeaturesSectionProps {
  title: string
  description: string
  image: string
  sidebar: Array<{ title: string; isActive?: boolean }> | undefined
  items:
    | Array<{
        title: string
        description: string
        image?: string
      }>
    | undefined
}

export default function FeaturesSection({ title, description, image, sidebar = [], items = [] }: FeaturesSectionProps) {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">{title}</h2>
      <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">{description}</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          {Array.isArray(sidebar) &&
            sidebar.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors",
                  item.isActive && "bg-indigo-600 text-white hover:bg-indigo-700",
                )}
              >
                {item.title}
              </div>
            ))}
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Image
                src={image || "/placeholder.svg"}
                alt="Feature illustration"
                width={500}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div>
              {Array.isArray(items) &&
                items.map((item, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
