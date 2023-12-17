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
              <h3 className="text-xl font-semibold mb-2">Academic Calendar</h3>
              <p>Access the Stevens Institute of Technology Academic Calendar for important dates and deadlines.</p>
              <a href="https://www.stevens.edu/page-basic/academic-calendar" target="_blank" rel="noopener noreferrer" className="button mt-4  text-blue-600 hover:text-blue-800">Learn More</a>
            </div>
            
            <div className="resource-card">
              <h3 className="text-xl font-semibold mb-2">Stevens Support Portal</h3>
              <p>Find support resources and assistance for various services at Stevens Institute of Technology.</p>
              <a href="https://support.stevens.edu/support/solutions/19000058786" target="_blank" rel="noopener noreferrer" className="button mt-4 text-blue-600 hover:text-blue-800">Learn More</a>
            </div>

            <div className="resource-card">
              <h3 className="text-xl font-semibold mb-2">Stevens Office of the Registrar</h3>
              <p>Visit the Office of the Registrar for academic records, registration, course information, and more.</p>
              <a href="https://www.stevens.edu/office-of-the-registrar" target="_blank" rel="noopener noreferrer" className="button mt-4  text-blue-600 hover:text-blue-800">Learn More</a>
            </div>

            <div className="resource-card">
              <h3 className="text-xl font-semibold mb-2">International Student and Scholar Services</h3>
              <p>Explore resources and support services for international students and scholars at Stevens.</p>
              <a href="https://www.stevens.edu/page-minisite-landing/isss" target="_blank" rel="noopener noreferrer" className="button mt-4  text-blue-600 hover:text-blue-800">Learn More</a>
            </div>

            <div className="resource-card">
              <h3 className="text-xl font-semibold mb-2">MyStevens</h3>
              <p>Login to MyStevens to access all resources offered to Stevens Institute of Technology students.</p>
              <a href="https://login.stevens.edu/" target="_blank" rel="noopener noreferrer" className="button mt-4  text-blue-600 hover:text-blue-800">Learn More</a>
            </div>

            <div className="resource-card">
              <h3 className="text-xl font-semibold mb-2">Stevens Division of Information Technology</h3>
              <p>Explore IT resources and support services for Stevens students. </p>
              <a href="https://www.stevens.edu/division-information-technology" target="_blank" rel="noopener noreferrer" className="button mt-4  text-blue-600 hover:text-blue-800">Learn More</a>
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
          {/* Contact Form */}
          <form action="https://formspree.io/f/xyyrgzzw" method="POST">
            <input type="text" name="name" placeholder="Your Name" className="mb-4 w-full p-2" />
            <input type="email" name="_replyto" placeholder="Your Email" className="mb-4 w-full p-2" />
            <textarea name="message" placeholder="Your Message" className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"></textarea>
            <Button type="submit" className="w-full mb-8">
            Send Message
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container mx-auto text-center">
            <div className="footer-links grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <a href="/" className="text-base hover:text-blue-600">Home</a>
            <a href="/faq" className="text-base hover:text-blue-600">FAQ</a>
            <a href="/aboutus" className="text-base hover:text-blue-600">About</a>
            <a href="/resources" className="text-base hover:text-blue-600">Resources</a>
            </div>
            <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
        </div>
       </footer>
    </main>
  );
}

export default Resources;