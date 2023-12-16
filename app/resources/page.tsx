import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";


const Resources: React.FC = () => {
  return (
    <main className="resources-page">
      {/* Resource Centre Header */}
      <section className="resource-centre-header container mx-auto text-center py-24 ">
        <h1 className="text-5xl font-bold mb-6">Resource Centre</h1>
        <p className="text-xl">
          Explore a wealth of resources and get in touch with us for any assistance.
        </p>
      </section>

      {/* Resources Section */}
      <section className="resources-section py-12 mb-10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* List of more resources here */}
            {/* Resource Card Placeholder*/}
            <div className="resource-card">
              <h3 className="text-xl font-semibold mb-2">Resource Title</h3>
              <p>Description or content of the resource.</p>
              <Button className="mt-4">Learn More</Button>
            </div>
            {/* Repeat for other resources */}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us-section">
        <div className="container mx-auto max-w-4xl text-center p-8">
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <p className="text-xl mb-6">
            Have questions or need support? Our team is here to help.
          </p>
          {/* Contact Form or Contact Information */}
          <div className="contact-form">
            {/* Example Contact Form */}
            <Input type="text" placeholder="Your Name" className="mb-4" />
            <Input type="email" placeholder="Your Email" className="mb-4" />
            <textarea placeholder="Your Message" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"></textarea>
            <Button>Send Message</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container mx-auto text-center">
            <div className="footer-links grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <a href="/" className="text-base">Home</a>
            <a href="/faq" className="text-base">FAQ</a>
            <a href="/aboutus" className="text-base">About</a>
            <a href="/resources" className="text-base">Resources</a>
            </div>
            <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
        </div>
       </footer>
    </main>
  );
}

export default Resources;
