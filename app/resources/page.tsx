import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const Resources: React.FC = () => {
  return (
    <main className="resources-page">
      {/* Resource Centre Header */}
      <section className="resource-centre-header container mx-auto mb-10 bg-[rgba(0,0,0,0.5)] py-24 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold">Resource Centre</h1>
        <p className="text-xl">
          Explore a wealth of resources and get in touch with us for any
          assistance.
        </p>
      </section>

      {/* Resources Section */}
      <section className="resources-section  mb-10 bg-[rgba(0,0,0,0.5)] py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold">Resources</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* List of more resources here */}
            {/* Resource Card Placeholder*/}
            <div className="resource-card mb-6 rounded-lg bg-white p-4 text-black shadow-lg">
              <h3 className="mb-2 text-xl font-semibold">Resource Title</h3>
              <p>Description or content of the resource.</p>
              <Button className="mt-4">Learn More</Button>
            </div>
            {/* Repeat for other resources */}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us-section bg-[rgba(0,0,0,0.5)] py-12 text-white">
        <div className="container mx-auto max-w-4xl p-8 text-center">
          <h2 className="mb-8 text-3xl font-bold">Contact Us</h2>
          <p className="mb-6 text-xl">
            Have questions or need support? Our team is here to help.
          </p>
          {/* Contact Form or Contact Information */}
          <div className="contact-form">
            {/* Example Contact Form */}
            <Input type="text" placeholder="Your Name" className="mb-4" />
            <Input type="email" placeholder="Your Email" className="mb-4" />
            <textarea
              placeholder="Your Message"
              className="mb-4 w-full rounded-lg border border-gray-300 p-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <Button>Send Message</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section py-8 text-white">
        <div className="container mx-auto text-center">
          <div className="footer-links mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <a href="/" className="text-base hover:text-white">
              Home
            </a>
            <a href="/faq" className="text-base hover:text-white">
              FAQ
            </a>
            <a href="/aboutus" className="text-base hover:text-white">
              About
            </a>
            <a href="/resources" className="text-base hover:text-white">
              Resources
            </a>
          </div>
          <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

export default Resources
