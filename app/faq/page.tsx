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
        <h3 className="text-2xl font-semibold mb-8 cursor-pointer" onClick={toggleOpen}>
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
      <section className="faq-header-section container mx-auto text-center py-24">
        <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl">
          Everything you need to know to get started and navigate UniGrow with ease.
        </p>
      </section>

      {/* Questions Section */}
      <section className="faq-questions-section py-6">
        <div className="container mx-auto divide-y divide-gray-300">
          <FaqItem 
            question="Is my Canvas data and key secure with UniGrow?" 
            answer="Absolutely. We use your Canvas data solely for its intended purpose and never for anything else. Your privacy is our priority."
          />
          <FaqItem question="How can I obtain my Canvas key?">
            <p>Getting your Canvas key is simple. You can also watch our step-by-step guide on YouTube for detailed instructions.</p>

            <ol className="list-decimal pl-6">
              <li>
                Log into Canvas at <a href="https://sit.instructure.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">https://sit.instructure.com</a>.
              </li>
              <li>
                Click "Account" in the left menu, then select "Settings."
              </li>
              <li>
                Scroll down to "Approved Integration" and click on "New Access Token."
              </li>
              <li>
                Fill in the "Purpose" field and, for added security, set an expiry date for your token.
              </li>
              <li>
                Click "Generate Token," then copy and securely save your newly generated token.
              </li>
            </ol>
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

            <FaqItem 
            question="How does UniGrow handle user feedback and suggestions?"
            answer="We value user feedback and regularly update our platform based on suggestions to continually enhance the user experience."
            />
            
            <FaqItem 
            question="What courses can I take at Stevens?"
            answer="Undergraduate students may take any 500-level course for which they satisfy the prerequisites. 600 level courses may be taken only by undergraduates with GPA 3.0 or greater and with the permission of the course instructor."
            />
            
            <FaqItem 
            question="Where do I find deadlines for registering or dropping classes?"
            answer="Please consult the Stevens Academic Calendar for all deadlines"
            />
            
            <FaqItem 
            question="How do I register for a class for which I took the prerequisite courses but not at Stevens? The system will not let me register for this class."
            answer="Fill out the change of enrollment form and email it to the course instructor along with an explanation of why you think you have the background necessary to succeed in the course. If the instructor agrees that you are adequately prepared for the course, he/she will finish filling out the form, digitally sign it, then email it back to you. You can then present the signed form to the Registrar and you will be allowed into the course. Note that only the course instructor can waive the prerequisite, not your advisor."
            />
            
            <FaqItem 
            question="How do I drop a course that I am registered for?"
            answer="You must fill out the change-of-enrollment form, have the course instructor sign it, and then submit it to Ms. Cucchiara. Be sure to submit the form before the last day to add or drop classes"
            />
            
            <FaqItem 
            question="Can I substitute a different course for one required for a graduate certificate?"
            answer="Your advisor may allow course substitution if the courses are very close in content. Otherwise, no."
            />
            
            <FaqItem 
            question="Is there a limit on the number of WebCampus (WS) courses I may take?"
            answer="There is no limit on the number of WebCampus courses that a US student may take. International students are required to take at least 6 credits of classroom courses per semester. Since most graduate courses are 3 credits, an international student registered for 9 credits may take at most one WebCampus course that semester; an international student registered for 12 credits may take at most two WebCampus courses that semester. There is no limit on the total number of WebCampus courses that may be applied to an international student's degree, only a per-semester limit implied by the 6-credit rule."
            />
            
            <FaqItem 
            question="How can I maintain full time status in my final semester?"
            answer="Full time status for an international student is defined to be 9 credits, except for the final semester. For example, if you have taken 9 credits in each of your first three semesters, then it is acceptable to take only 3 credits in your final semester."
            />






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
