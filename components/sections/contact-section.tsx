import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MailIcon } from "lucide-react"

interface ContactSectionProps {
  title: string
  description?: string
  email: string
  mapImage: string
  ctaButton: {
    label: string
    url: string
  }
}

export default function ContactSection({ title, description, email, mapImage, ctaButton }: ContactSectionProps) {
  return (
    <section className="bg-indigo-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
            {description && <p className="mb-6">{description}</p>}
            <div className="flex items-center mb-6">
              <MailIcon className="h-5 w-5 mr-2" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </div>
            <Button size="lg" variant="secondary">
              {ctaButton.label}
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src={mapImage || "/placeholder.svg"}
              alt="Location map"
              width={600}
              height={400}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
