import SearchBar from "./SearchBar";

const HeroSection = () => {
  return (
    <section className="hero-section text-center h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl font-extrabold leading-[1.15] text-black sm:text-6xl">
        Lost Something?
        <br />
        <span className="bg-gradient-to-r from-pink-500 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
          We're Here to Help!
        </span>
      </h1>
      <h2 className="mt-5 text-gray-600 sm:text-xl font-medium max-w-2xl">
        Easily find and report lost items on campus through our platform.
        <br />
        CampusFind is a platform that connects students to help them find their
        lost items on campus.
      </h2>

      {/* Search Bar */}
      <div className="w-full max-w-lg mx-auto mt-8 mb-6">
        <SearchBar
          placeholder="Search for lost items..."
          onSearch={(query) => console.log("Searching for:", query)}
        />
      </div>

      <div className="mx-auto flex gap-4 mb-4">
        <a
          href="#get-started"
          className="rounded-full px-9 py-3 text-sm font-medium shadow-sm bg-[#a402cc] text-white hover:bg-opacity-90"
        >
          Get Started
        </a>
        <a
          href="#testimonials"
          className="rounded-full px-9 py-3 text-sm font-medium shadow-sm text-gray-800 bg-white hover:bg-gray-50"
        >
          Learn More
        </a>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-10 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      {/* Scroll indicator with smooth scrolling script */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-bounce">
        <a
          href="#testimonials"
          className="text-gray-500 hover:text-indigo-600"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("testimonials")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
