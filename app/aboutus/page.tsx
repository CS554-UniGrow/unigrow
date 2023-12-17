import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function About() {
  return (
    <main>
      {/* Page Header */}
      <section className="page-header-section container mx-auto my-8  p-8 py-24 text-center">
        <h1 className="mb-6 text-5xl font-bold">About UniGrow</h1>
        <p className="mb-8 text-xl">
          Discover the vision, team, and passion behind UniGrow.
        </p>
      </section>

      {/* Our Vision */}
      <section className="our-vision-section container mx-auto my-8  p-8 text-center">
        <div className="container mx-auto">
          <h2 className="mb-4 text-3xl  font-bold">Our Vision</h2>
          <p className="mb-6 text-xl">
            At UniGrow, we aim to revolutionize the academic experience by
            connecting students and educators on a dynamic platform for growth
            and collaboration. We believe that education should be accessible,
            inclusive, and empowering.
          </p>
          <p className="mb-6 text-xl">
            Our commitment extends beyond providing educational resources. We
            strive to create a nurturing environment where students can share
            insights, educators can disseminate knowledge, and together, build a
            community that values learning and innovation.
          </p>
          <p className="mb-6 text-xl">
            With a focus on intuitive technology and user-centric design,
            UniGrow facilitates a seamless integration of academic tools and
            social connectivity. We&apos;re not just building a platform;
            we&apos;re fostering a movement towards a brighter, more connected
            future in education.
          </p>
        </div>
      </section>

      <section className="our-values-section container mx-auto my-8 p-8 text-center">
        <div className="container mx-auto">
          <h2 className="mb-8 text-3xl font-bold">Our Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Value: Innovation */}
            <div className="value-card rounded-lg shadow-lg">
              <h3 className="mb-3 text-xl font-semibold">Innovation</h3>
              <p>
                Pioneering the future of educational technology with creativity
                and a forward-thinking mindset.
              </p>
            </div>
            {/* Value: Empowerment */}
            <div className="value-card rounded-lg shadow-lg">
              <h3 className="mb-3 text-xl font-semibold">Empowerment</h3>
              <p>
                Equipping students with the tools and confidence to take charge
                of their learning journey.
              </p>
            </div>
            {/* Value: Community */}
            <div className="value-card rounded-lg shadow-lg">
              <h3 className="mb-3 text-xl font-semibold">Community</h3>
              <p>
                Cultivating a vibrant ecosystem where collaboration and shared
                success are celebrated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="meet-the-team-section my-8  py-12">
        <div className="container mx-auto p-8 text-center">
          <h2 className="mb-8 text-3xl font-bold">Meet the Team</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Team Member Card */}
            <Card className="team-member-card rounded-lg shadow-lg">
              <h3 className="mb-2 text-xl font-semibold">Dhruv Vaghela</h3>
              <p className="mb-4">Stevens Institute of Technology</p>
              <a
                href="https://www.linkedin.com/in/dhruv-vaghela/"
                target="_blank"
                rel="noopener noreferrer"
                className= "hover:text-blue-800"
              >
                LinkedIn Profile
              </a>
            </Card>
            {/* Repeat for other team members */}
            <Card className="team-member-card rounded-lg shadow-lg">
              <h3 className="mb-2 text-xl font-semibold">Sanjeet Jain</h3>
              <p className="mb-4">Stevens Institute of Technology</p>
              <a
                href="https://www.linkedin.com/in/sanjeet-jain/"
                target="_blank"
                rel="noopener noreferrer"
                className= "hover:text-blue-800"
              >
                LinkedIn Profile
              </a>
            </Card>
            <Card className="team-member-card rounded-lg shadow-lg">
              <h3 className="mb-2 text-xl font-semibold">Yash Baleri</h3>
              <p className="mb-4">Stevens Institute of Technology</p>
              <a
                href="https://www.linkedin.com/in/yashbaleri/"
                target="_blank"
                rel="noopener noreferrer"
                className= "hover:text-blue-800"
              >
                LinkedIn Profile
              </a>
            </Card>
            <Card className="team-member-card rounded-lg shadow-lg">
              <h3 className="mb-2 text-xl font-semibold">Yuvaraj Nagi</h3>
              <p className="mb-4">Stevens Institute of Technology</p>
              <a
                href="https://www.linkedin.com/in/yuvaraj-nagi-91702b173/"
                target="_blank"
                rel="noopener noreferrer"
                className= "hover:text-blue-800"
              >
                LinkedIn Profile
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story-section container mx-auto my-8 p-8 text-center">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Our Story
          </h2>
          <p className="mb-6 text-xl">
            Born from the simple need to demystify course selection, UniGrow was
            conceived by students, for students.
          </p>
          <p className="mb-6 text-xl">
            Our platform emerged from our own struggles to access genuine course
            insights and connect with peers. It&apos;s a testament to the power
            of shared knowledge and the spirit of collaboration.
          </p>
        </div>
      </section>
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
  )
}
