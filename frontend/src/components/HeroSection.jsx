import SearchBar from "./SearchBar";

const HeroSection = () => {
  return (
    <section className="hero-section text-center mt-32 flex flex-col">
      <h1 className=" text-4xl font-extrabold leading-[1.15] text-black sm:text-6xl ">
        Lost Something?
        <br />
        <span className="bg-gradient-to-r from-pink-500 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
          {/* Reunite with Your Lost Items on Campus!
           */}
          We'er Here to Help!
        </span>
      </h1>
      <h2 className="mt-5 text-gray-600 sm:text-xl font-medium">
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

      <div className="mx-auto flex gap-4">
        <a
          href="#get-started"
          className="rounded-full px-9 py-3 text-sm font-medium shodow-sm bg-[#a402cc] text-white"
        >
          Get Started
        </a>
        <a
          href="#learn-more"
          className="rounded-full px-9 py-3 text-sm font-medium shadow-sm text-gray-800  bg-white
"
        >
          Learn More
        </a>
      </div>
    </section>
  );
};
export default HeroSection;
