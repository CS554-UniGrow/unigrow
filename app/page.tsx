import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session: any = await getServerSession(options)

  return (
    <div>
      <section className="hero-section container mx-auto mb-10 text-center">
        <h1 className="mb-12 text-5xl font-bold">
          Empowering Your Academic Journey
        </h1>
        <p className="mb-8 text-xl">
          UniGrow brings the entirety of your campus experience right at your
          fingertips. Connect, explore, and grow with our comprehensive suite of
          tools.
        </p>
        <Button asChild>
          <Link href="/signup">Join Our Community</Link>
        </Button>
      </section>

      <section className="features-section bg-black-100 py-2">
        <div className="container mx-auto grid grid-cols-3 gap-8">
          <Card className="feature-card transition duration-300 hover:shadow-lg">
            <h2 className="feature-title mx-3 mb-4 text-xl font-semibold">
              Syllabus at a Glance
            </h2>
            <p className="mx-3">
              Automatically synchronize the latest syllabus from Canvas. Stay
              updated and plan ahead with ease.
            </p>
          </Card>
          <Card className="feature-card transition duration-300 hover:shadow-lg">
            <h2 className="feature-title mx-3 mb-4 text-xl font-semibold">
              Connect Instantly
            </h2>
            <p className="mx-3">
              Engage in real-time discussions with peers and mentors. The
              knowledge you need, shared and received live.
            </p>
          </Card>
          <Card className="feature-card transition duration-300 hover:shadow-lg">
            <h2 className="feature-title mx-3 mb-4 text-xl font-semibold">
              Peer Insights
            </h2>
            <p className="mx-3">
              Benefit from collective wisdom. Rate and review courses with
              insights from those who experienced them.
            </p>
          </Card>
        </div>
      </section>

      <section className="about-section my-10">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Our Mission</h2>
          <Card>
            <p className="font my-3 mb-6 text-lg">
              We envision a campus ecosystem where information flows freely,
              collaboration is the norm, and academic resources are readily at
              hand.
            </p>
            <p className="my-3 mb-6 text-lg">
              Our platform is more than just a tool; it&apos;s a gateway to
              unlocking your potential. By seamlessly integrating with Canvas,
              we provide instant access to course syllabi, facilitate real-time
              discussions, and offer a robust database of peer-driven course
              ratings and reviews.
            </p>
            <p className="my-3 text-lg">
              Join us on this journey. Embrace the possibilities that lay before
              you and become a part of a vibrant community dedicated to
              educational success. With UniGrow, your academic aspirations are
              within reach.
            </p>
          </Card>

          <Button asChild className="mt-7">
            <Link href="/aboutus">Learn More</Link>
          </Button>
        </div>
      </section>

      <div className="color= bg-clip-padding "></div>

      <section className="testimonials-section bg-black-100 py-8">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Success Stories
          </h2>

          <div className="testimonial-carousel">
            <Card className="testimonial-item">
              <p className="mx-3 my-3">
                &quot;The course selection process was always daunting, but
                UniGrow&apos;s intuitive platform made it a breeze. The peer
                reviews and detailed syllabi gave me the confidence to choose
                the right courses for my career goals.&quot;
              </p>
              <footer className="testimonial-author mx-3">
                — Yash Kapoor, Master&apos;s in Compute Science, Fall 2022
              </footer>
            </Card>

            <br />

            <Card className="testimonial-item ">
              <p className="mx-3 my-3">
                &quot;Connecting with peers through UniGrow transformed my study
                sessions. It was incredibly insightful to exchange ideas with
                those who&apos;ve walked the path before.&quot;
              </p>
              <footer className="mx-3 my-3">
                — Jane Doe, Master&apos;s in Data Science, Spring 2023
              </footer>
            </Card>
          </div>
        </div>
      </section>
      <section className="cta-section py-12">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-4xl font-bold">Join the UniGrow Family</h2>
          <p className="mb-6">
            Ready to take the next step in your academic career? Become a part
            of a thriving community that&apos;s all about growth and success.
          </p>
          <Button asChild>
            <Link href="/signup">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      <footer className="footer-section">
        <div className="container mx-auto text-center">
          <div className="footer-links mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/" className="text-base hover:text-blue-600">
              Home
            </Link>
            <Link href="/faq" className="text-base hover:text-blue-600">
              FAQ
            </Link>
            <Link href="/aboutus" className="text-base hover:text-blue-600">
              About
            </Link>
            <Link href="/resources" className="text-base hover:text-blue-600">
              Resources
            </Link>
          </div>
          <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
