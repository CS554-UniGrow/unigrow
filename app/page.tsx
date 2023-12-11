import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto text-center py-24">
        <h1 className="text-5xl font-bold mb-6">Welcome to UniGrow</h1>
        <p className="text-xl mb-8">The ultimate platform for students.</p>
        <Link href="/signup">
          <Button className="px-8 py-2">Get Started</Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-black-100 py-12">
        <div className="container mx-auto grid grid-cols-3 gap-8">
          {/* Repeat this Card for each feature your platform offers */}
          <Card className="hover:shadow-lg transition duration-300">
            <h2 className="text-xl font-semibold">Feature 1</h2>
            <p>Description of the feature.</p>
          </Card>
          {/* ... other feature cards */}
        </div>
      </section>

      {/* About Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About Us</h2>
          <p className="text-xl">Learn more about our mission and the team behind UniGrow.</p>
          {/* Add more content about your platform here */}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-black-100 py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">What People Are Saying</h2>
          <div className="grid grid-cols-3 gap-8">
            {/* Repeat for each testimonial */}
            <blockquote>
              <p>"This platform has transformed the way I learn and teach."</p>
              <footer>- User Name</footer>
            </blockquote>
            {/* ... other testimonials */}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <Link href="/signup">
            <Button className="px-8 py-2">Sign Up Now</Button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} UniGrow. All rights reserved.</p>
          {/* Add more footer content such as links to social media, privacy policy, etc. */}
        </div>
      </footer>
    </main>
  );
}
