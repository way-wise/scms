import Image from "next/image"

interface IntegrationLogo {
  name: string
  logo: string
}

interface IntegrationsSectionProps {
  title: string
  description?: string
  logos: IntegrationLogo[] | undefined
}

export default function IntegrationsSection({ title, description, logos = [] }: IntegrationsSectionProps) {
  if (!Array.isArray(logos) || logos.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      {description && <p className="text-gray-600 max-w-3xl mx-auto mb-12">{description}</p>}

      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto">
        {logos.map((integration, index) => (
          <div key={index} className="h-16">
            <Image
              src={integration.logo || "/placeholder.svg"}
              alt={integration.name}
              width={120}
              height={64}
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
