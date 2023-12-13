import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function About() {
  return (
    <main>
        {/* Page Header */}
        <section className="page-header-section container mx-auto text-center py-24 bg-[rgba(0,0,0,0.5)] my-8 p-8">
            <h1 className="text-5xl font-bold mb-6">About UniGrow</h1>
            <p className="text-xl mb-8">
            Discover the vision, team, and passion behind UniGrow.
            </p>
        </section>

        {/* Our Vision */}
        <section className="our-vision-section text-center container mx-auto bg-[rgba(0,0,0,0.5)] my-8 p-8">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold  text-white mb-4">Our Vision</h2>
            <p className="text-xl text-white mb-6">
            At UniGrow, we aim to revolutionize the academic experience by connecting students and educators on a dynamic platform for growth and collaboration. We believe that education should be accessible, inclusive, and empowering.
            </p>
            <p className="text-xl text-white mb-6">
            Our commitment extends beyond providing educational resources. We strive to create a nurturing environment where students can share insights, educators can disseminate knowledge, and together, build a community that values learning and innovation.
            </p>
            <p className="text-xl text-white mb-6">
            With a focus on intuitive technology and user-centric design, UniGrow facilitates a seamless integration of academic tools and social connectivity. We're not just building a platform; we're fostering a movement towards a brighter, more connected future in education.
            </p>
        </div>
        </section>

        <section className="our-values-section container text-center mx-auto bg-[rgba(0,0,0,0.5)] my-8 p-8">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value: Innovation */}
            <div className="value-card bg-white p-4 rounded-lg shadow-lg text-black">
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p>
                Pioneering the future of educational technology with creativity and a forward-thinking mindset.
                </p>
            </div>
            {/* Value: Empowerment */}
            <div className="value-card bg-white p-4 rounded-lg shadow-lg text-black">
                <h3 className="text-xl font-semibold mb-3">Empowerment</h3>
                <p>
                Equipping students with the tools and confidence to take charge of their learning journey.
                </p>
            </div>
            {/* Value: Community */}
            <div className="value-card bg-white p-4 rounded-lg shadow-lg text-black">
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p>
                Cultivating a vibrant ecosystem where collaboration and shared success are celebrated.
                </p>
            </div>
            </div>
        </div>
        </section>

        {/* Meet the Team */}
        <section className="meet-the-team-section bg-[rgba(0,0,0,0.5)] py-12 my-8">
        <div className="container mx-auto text-center p-8">
            <h2 className="text-3xl font-bold text-white mb-8">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member Card */}
            <Card className="team-member-card bg-white p-4 rounded-lg shadow-lg text-black">
            <h3 className="text-xl font-semibold mb-2">Dhruv Vaghela</h3>
            <p className="mb-4">Stevens Institute of Technology</p>
            <a href="https://www.linkedin.com/in/dhruv-vaghela/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800">
                LinkedIn Profile
            </a>
            </Card>
            {/* Repeat for other team members */}
            <Card className="team-member-card bg-white p-4 rounded-lg shadow-lg text-black">
            <h3 className="text-xl font-semibold mb-2">Sanjeet Jain</h3>
            <p className="mb-4">Stevens Institute of Technology</p>
            <a href="https://www.linkedin.com/in/sanjeet-jain/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800">
                LinkedIn Profile
            </a>
            </Card>
            <Card className="team-member-card bg-white p-4 rounded-lg shadow-lg text-black">
            <h3 className="text-xl font-semibold mb-2">Yash Baleri</h3>
            <p className="mb-4">Stevens Institute of Technology</p>
            <a href="https://www.linkedin.com/in/yashbaleri/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800">
                LinkedIn Profile
            </a>
            </Card>
            <Card className="team-member-card bg-white p-4 rounded-lg shadow-lg text-black">
            <h3 className="text-xl font-semibold mb-2">Yuvaraj Nagi</h3>
            <p className="mb-4">Stevens Institute of Technology</p>
            <a href="https://www.linkedin.com/in/yuvaraj-nagi-91702b173/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800">
                LinkedIn Profile
            </a>
            </Card>
            </div>
        </div>
        </section>

        {/* Our Story */}
        <section className="our-story-section container mx-auto bg-[rgba(0,0,0,0.5)] my-8 p-8">
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-white mb-8">Our Story</h2>
            <p className="text-xl text-white mb-6">
            Born from the simple need to demystify course selection, UniGrow was conceived by students, for students. 
            </p>
            <p className="text-xl text-white mb-6">
            Our platform emerged from our own struggles to access genuine course insights and connect with peers. It's a testament to the power of shared knowledge and the spirit of collaboration. 
            </p>
        </div>
        </section>
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


