import Image from "next/image"
import { StarIcon } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: {
    name: string
    title: string
    company: string
    avatar: string
  }
  rating: number
}

interface TestimonialsSectionProps {
  title: string
  testimonials: TestimonialProps[] | undefined
}

export default function TestimonialsSection({ title, testimonials = [] }: TestimonialsSectionProps) {
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`inline-block h-5 w-5 ${
                    i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <blockquote className="text-gray-700 mb-6">{testimonial.quote}</blockquote>
            <div className="flex items-center">
              <Image
                src={testimonial.author.avatar || "/placeholder.svg"}
                alt={testimonial.author.name}
                width={48}
                height={48}
                className="rounded-full mr-4"
              />
              <div>
                <div className="font-semibold">{testimonial.author.name}</div>
                <div className="text-sm text-gray-600">
                  {testimonial.author.title}, {testimonial.author.company}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
