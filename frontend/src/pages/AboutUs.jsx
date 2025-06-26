import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const AboutUs = () => {
  // Team members data - you can update these with actual team member information
  const teamMembers = [
    {
      id: 1,
      name: "Team Member 1",
      role: "Full Stack Developer",
      image: "/src/assets/images/team/member1.jpg", // Replace with actual image path
      description:
        "Specialized in frontend development and user experience design.",
    },
    {
      id: 2,
      name: "Team Member 2",
      role: "Backend Developer",
      image: "/src/assets/images/team/member2.jpg", // Replace with actual image path
      description: "Expert in server-side development and database management.",
    },
    {
      id: 3,
      name: "Team Member 3",
      role: "UI/UX Designer",
      image: "/src/assets/images/team/member3.jpg", // Replace with actual image path
      description:
        "Focused on creating intuitive and beautiful user interfaces.",
    },
    {
      id: 4,
      name: "Team Member 4",
      role: "Project Manager",
      image: "/src/assets/images/team/member4.jpg", // Replace with actual image path
      description: "Coordinates team efforts and ensures project delivery.",
    },
    {
      id: 5,
      name: "Team Member 5",
      role: "Quality Assurance",
      image: "/src/assets/images/team/member5.jpg", // Replace with actual image path
      description:
        "Ensures the application meets quality standards and user requirements.",
    },
    {
      id: 6,
      name: "Team Member 6",
      role: "DevOps Engineer",
      image: "/src/assets/images/team/member6.jpg", // Replace with actual image path
      description:
        "Manages deployment, infrastructure, and continuous integration.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 bg-gradient-to-br from-[#098dc1] to-[#a402cc]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About CampusFind
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We are a dedicated team of students passionate about creating
            solutions that make campus life easier. CampusFind was born from our
            shared experience of losing and finding items around campus.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To create a seamless platform that connects students who have lost
              items with those who have found them, fostering a sense of
              community and reducing the stress of losing valuable belongings on
              campus.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-[#098dc1] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Easy Search
              </h3>
              <p className="text-gray-600">
                Quickly find lost items with our intuitive search functionality.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-[#a402cc] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Built by students, for students, fostering campus community.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600">
                Safe platform with verified users and secure item claiming
                process.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The brilliant minds behind CampusFind - a group of passionate
              students committed to making campus life better for everyone.
            </p>
          </div>

          {/* Team Members Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a default avatar if image fails to load
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name
                      )}&background=098dc1&color=fff&size=128`;
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {member.name}
                </h3>
                <p className="text-[#098dc1] font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-[#098dc1] to-[#a402cc]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find What You've Lost?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our community and never worry about lost items again.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-[#098dc1] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Get Started Today
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
