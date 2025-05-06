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
      <h2 className="mt-5 text-gray-600 sm:text-xl">
        Easily find and report lost items on campus through our platform.
        <br />
        CampusFind is a platform that connects students to help them find their
        lost items on campus.
      </h2>
      <div className="mx-auto mt-5 flex gap-6">
        <a
          href="#get-started"
          className="rounded-full border px-5 py-2 text-sm font-medium shodow-sm border-white bg-blue-500 text-white hover:ring-gray-200 hover:ring-2"
        >
          Get Started
        </a>
        <a
          href="#learn-more"
          className="rounded-full border px-5 py-2 text-sm font-medium shodow-sm border-gray-200 bg-white text-blue-500 hover:ring-gray-300 hover:ring-2"
        >
          learn more
        </a>
      </div>
    </section>
  );
};
export default HeroSection;
