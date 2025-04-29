import Image from "next/image"
import { CheckIcon } from "lucide-react"

interface BenefitProps {
  title: string
  image: string
  items: Array<{ text: string }>
}

interface BenefitsSectionProps {
  benefits: BenefitProps[] | undefined
}

export default function BenefitsSection({ benefits = [] }: BenefitsSectionProps) {
  if (!Array.isArray(benefits) || benefits.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="space-y-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Image
                  src={benefit.image || "/placeholder.svg"}
                  alt={benefit.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-2 p-6">
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <ul className="space-y-2">
                  {Array.isArray(benefit.items) &&
                    benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
