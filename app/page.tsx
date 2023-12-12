import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section 
      hero-section: Apply background images, colors, or any other large section styles here.
      container mx-auto: Centers your content and applies max-width with automatic margins.
      text-center: Aligns text to the center.
      py-24: Applies padding to the top and bottom of the section (24 is a scale value).
      text-5xl: Sets the text size for the heading.
      font-bold: Makes the font weight bold.
      mb-6: Adds a margin-bottom (6 is a scale value).
      text-xl: Sets the text size for the paragraph.
      mb-8: Adds a margin-bottom to the paragraph.*/}

      <section className="hero-section container mx-auto text-center py-24">
        <h1 className="text-5xl font-bold mb-6">Empowering Your Academic Journey</h1>
        <p className="text-xl mb-8">
          UniGrow brings the entirety of your campus experience right at your fingertips. Connect, explore, and grow with our comprehensive suite of tools.
        </p>
        <Link href="/signup">
          <Button className="cta-button">Join Our Community</Button>
        </Link>
      </section>

      {/* Detailed Features Section 
      
      features-section bg-black-100: Sets the background color of the features section.
      py-12: Adds vertical padding to the section.
      grid grid-cols-3: Creates a grid layout with 3 columns.
      gap-8: Sets the gap between grid items.
      feature-card hover:shadow-lg: Styles the card, and hover:shadow-lg adds a large shadow on hover.
      transition duration-300: Smooths the transition of the shadow effect.
      
      */}
      <section className="features-section bg-black-100 py-12">
        <div className="container mx-auto grid grid-cols-3 gap-8">
          {/* Dynamic Feature Cards */}
          {/* Feature 1: Course Syllabus Integration */}
          <Card className="feature-card hover:shadow-lg transition duration-300">
            <h2 className="feature-title text-xl font-semibold">Syllabus at a Glance</h2>
            <p>
              Automatically synchronize the latest syllabus from Canvas. Stay updated and plan ahead with ease.
            </p>
          </Card>
          {/* Feature 2: Real-time Communication */}
          <Card className="feature-card hover:shadow-lg transition duration-300">
            <h2 className="feature-title text-xl font-semibold">Connect Instantly</h2>
            <p>
              Engage in real-time discussions with peers and mentors. The knowledge you need, shared and received live.
            </p>
          </Card>
          {/* Feature 3: User Rating System */}
          <Card className="feature-card hover:shadow-lg transition duration-300">
            <h2 className="feature-title text-xl font-semibold">Peer Insights</h2>
            <p>
              Benefit from collective wisdom. Rate and review courses with insights from those who experienced them.
            </p>
          </Card>
          {/* Additional feature cards as necessary */}
        </div>
      </section>

      <section className="about-section py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl mb-6">
            We envision a campus ecosystem where information flows freely, collaboration is the norm, and academic resources are readily at hand.
          </p>
          <p className="text-xl mb-6">
            Our platform is more than just a tool; it's a gateway to unlocking your potential. By seamlessly integrating with Canvas, we provide instant access to course syllabi, facilitate real-time discussions, and offer a robust database of peer-driven course ratings and reviews. 
          </p>
          <p className="text-xl">
            Join us on this journey. Embrace the possibilities that lay before you and become a part of a vibrant community dedicated to educational success. With UniGrow, your academic aspirations are within reach.
          </p>
        </div>
      </section>

      <div className="bg-clip-padding color= "></div>


      {/* Testimonials Section with Carousel */}
      <section className="testimonials-section bg-black-100 py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Success Stories</h2>
          {/* Testimonials Carousel */}
          <div className="testimonial-carousel">
            {/* Individual Testimonials */}
            <blockquote className="testimonial-item">
              <p>"The course selection process was always daunting, but UniGrow's intuitive platform made it a breeze. The peer reviews and detailed syllabi gave me the confidence to choose the right courses for my career goals."</p>
              <footer className="testimonial-author">— Yash Kapoor, Master's in Compute Science, Fall 2022</footer>
            </blockquote>
            {/* Additional testimonials */}
            <br />
            {/* Individual Testimonials */}
            <blockquote className="testimonial-item">
              <p>"Connecting with peers through UniGrow transformed my study sessions. It was incredibly insightful to exchange ideas with those who've walked the path before."</p>
              <footer className="testimonial-author">— Jane Doe, Master's in Data Science, Spring 2023</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="cta-section py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Join the UniGrow Family</h2>
          <p className="mb-6">
            Ready to take the next step in your academic career? Become a part of a thriving community that's all about growth and success.
          </p>
          <Link href="/signup">
            <Button className="cta-button">Start Your Journey</Button>
          </Link>
        </div>
      </section>

      {/* Footer Section 
      bg-gray-800: Sets the background color of the footer.
      text-white: Sets the text color to white.
      py-8: Adds vertical padding.
      
      */}
      <footer className="text-white py-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
          {/* Add more footer content such as links to social media, privacy policy, etc. */}
        </div>
      </footer>
    </main>
  );
}


