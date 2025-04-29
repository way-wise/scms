import Link from "next/link"

interface FooterProps {
  links: Array<{ label: string; url: string }>
  copyright: string
}

export default function Footer({ links, copyright }: FooterProps) {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            {links.map((link, index) => (
              <Link key={index} href={link.url} className="text-sm text-gray-600 hover:text-gray-900">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-sm text-gray-600">{copyright}</div>
        </div>
      </div>
    </footer>
  )
}
