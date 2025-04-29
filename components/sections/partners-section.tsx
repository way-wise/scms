import Image from "next/image"

interface PartnerLogo {
  name: string
  logo: string
  url?: string
}

interface PartnersSectionProps {
  title: string
  logos: PartnerLogo[] | undefined
}

export default function PartnersSection({ title, logos = [] }: PartnersSectionProps) {
  if (!Array.isArray(logos) || logos.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-xl font-semibold text-center mb-8">{title}</h2>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
        {logos.map((partner, index) => (
          <div key={index} className="h-12">
            {partner.url ? (
              <a href={partner.url} target="_blank" rel="noopener noreferrer">
                <Image
                  src={partner.logo || "/placeholder.svg"}
                  alt={partner.name}
                  width={120}
                  height={48}
                  className="h-full w-auto object-contain"
                />
              </a>
            ) : (
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                width={120}
                height={48}
                className="h-full w-auto object-contain"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
