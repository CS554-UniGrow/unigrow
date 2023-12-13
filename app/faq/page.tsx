'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useState, ReactNode } from 'react';

interface FaqItemProps {
    question: string;
    answer?: string;
    children?: ReactNode;
  }
  
  const FaqItem: React.FC<FaqItemProps> = ({ question, answer, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOpen = () => setIsOpen(!isOpen);
  
    return (
      <div className="faq-question py-4">
        <h3 className="text-2xl font-semibold mb-4 cursor-pointer" onClick={toggleOpen}>
          {question}
        </h3>
        {isOpen && (
          <div className="text-xl">
            {children ? children : <p>{answer}</p>}
          </div>
        )}
      </div>
    );
  };



export default function Faq() {
  return (
    <main className="faq-page">
      {/* FAQ Header */}
      <section className="faq-header-section container mx-auto text-center py-24 bg-[rgba(0,0,0,0.5)] text-white">
        <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl">
          Everything you need to know to get started and navigate UniGrow with ease.
        </p>
      </section>

      {/* Questions Section */}
      <section className="faq-questions-section py-12">
        <div className="container mx-auto divide-y divide-gray-300">
          <FaqItem 
            question="Is my Canvas data and key secure with UniGrow?" 
            answer="Absolutely. We use your Canvas data solely for its intended purpose and never for anything else. Your privacy is our priority."
          />
          <FaqItem question="How can I obtain my Canvas key?">
            <p>Getting your Canvas key is simple. Watch our step-by-step guide on YouTube for detailed instructions.</p>
            {/* Embed a YouTube video */}
            <div className="video-container my-4">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/_yt8rfD7MTk"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </FaqItem>
          <FaqItem 
            question="Can I access UniGrow on multiple devices?" 
            answer="Yes, UniGrow is designed to be accessible on various devices, ensuring you can stay connected wherever you go."
            />

          <FaqItem 
            question="Are there any costs associated with using UniGrow?"
            answer="UniGrow is 100% free"
           />

            <FaqItem 
            question="What kind of support does UniGrow provide for new users?"
            answer="We provide comprehensive guides, tutorial videos, and responsive customer support to help new users navigate our platform with ease."
            />

            <FaqItem 
            question="Can I contribute to course reviews and ratings on UniGrow?"
            answer="Absolutely! We encourage users to share their experiences and insights by contributing to our course reviews and ratings."
            />

            <FaqItem 
            question="Does UniGrow offer any collaboration tools for group projects?"
            answer="Yes, our platform live chatting functionality"
            />

            <FaqItem 
            question="How does UniGrow handle user feedback and suggestions?"
            answer="We value user feedback and regularly update our platform based on suggestions to continually enhance the user experience."
            />

        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section text-white py-8">
        <div className="container mx-auto text-center">
            <div className="footer-links grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <a href="/" className="text-base hover:text-white">Home</a>
            <a href="/faq" className="text-base hover:text-white">FAQ</a>
            <a href="/aboutus" className="text-base hover:text-white">About</a>
            <a href="/resources" className="text-base hover:text-white">Resources</a>
            </div>
            <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
        </div>
       </footer>
    </main>
  );
}
