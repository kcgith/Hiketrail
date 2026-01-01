import { useNavigate } from "react-router";
import SearchAutocomplete from "../components/SearchAutocomplete";


export default function LandingPage() {
  const navigate = useNavigate();
  

  return (
    <div className="w-full overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/hero1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Get out there.
            <br />Meet people.
            <br />Create memories.
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200">
            Discover nearby activities. Join real people.
            Step out of your home and into real experiences.
          </p>

          {/* SEARCH – compact & safe */}
          <div className="mt-8 flex justify-center">
            <div className="max-w-md bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg text-black">
              <SearchAutocomplete />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold"
            >
              Explore Nearby
            </button>

            <button
              onClick={() => navigate("/activities/create")}
              className="px-6 py-3 border border-white rounded-lg text-lg hover:bg-white hover:text-black transition"
            >
              Create Activity
            </button>
          </div>
        </div>

        {/* subtle bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent" />
      </section>

      {/* ================= FLOATING CONTENT ================= */}
      <section
        className="relative py-24 px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/hero2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >

        {/* WHY CARD */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="rounded-3xl bg-white shadow-xl p-10 md:p-14">
            <div className="grid md:grid-cols-3 gap-10 text-center">
              <div>
                <h3 className="text-xl font-semibold mb-3">Real Humans</h3>
                <p className="text-gray-600">
                  No feeds. No followers. Just people meeting people.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Real Activities</h3>
                <p className="text-gray-600">
                  Hikes, runs, games, picnics, adventures — nearby and live.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Real Connection</h3>
                <p className="text-gray-600">
                  Meet once. Become friends. Create stories together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="rounded-3xl bg-white shadow-xl p-10 md:p-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              How it works
            </h2>

            <div className="grid md:grid-cols-4 gap-10 text-center">
              <div>
                <span className="text-3xl">📍</span>
                <h4 className="mt-4 font-semibold text-lg">
                  Discover
                </h4>
                <p className="mt-2 text-gray-600">
                  Browse activities happening near you.
                </p>
              </div>

              <div>
                <span className="text-3xl">➕</span>
                <h4 className="mt-4 font-semibold text-lg">
                  Join or Create
                </h4>
                <p className="mt-2 text-gray-600">
                  Join instantly or host your own activity.
                </p>
              </div>

              <div>
                <span className="text-3xl">💬</span>
                <h4 className="mt-4 font-semibold text-lg">
                  Coordinate with GROUP CHAT
                </h4>
                <p className="mt-2 text-gray-600">
                  Chat, plan, and stay updated in one place.
                </p>
              </div>

              <div>
                <span className="text-3xl">🌍</span>
                <h4 className="mt-4 font-semibold text-lg">
                  Experience LIVE LOCATION SHARING
                </h4>
                <p className="mt-2 text-gray-600">
                  Option to share live location to the host for outdoor activities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA CARD */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-white shadow-xl p-12 text-center overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-green-100 rounded-full opacity-50" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-green-200 rounded-full opacity-40" />

            <h2 className="text-3xl font-bold relative">
              Your city is full of life.
            </h2>
            <p className="mt-4 text-gray-600 text-lg relative">
              You just need a reason to step out.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="relative mt-8 px-8 py-3 bg-black text-white rounded-lg text-lg hover:bg-gray-800"
            >
              Start Exploring
            </button>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">OutsideR</h3>
            <p className="text-gray-400">
              Real people. Real activities. Real connections.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Nearby Activities</li>
              <li>Create Activity</li>
              <li>Profile</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Made for</h4>
            <p className="text-gray-400">
              People who want to step out and live.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
          © {new Date().getFullYear()} OutsideR. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
