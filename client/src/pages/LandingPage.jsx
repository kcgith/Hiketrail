import { useNavigate } from "react-router";
import SearchAutocomplete from "../components/SearchAutocomplete";
import ActivityCard from "../components/ActivityCard";
import { useNearbyActivities } from "../hooks/useNearbyActivities";

export default function LandingPage() {
  const navigate = useNavigate();
  const { activities, loading } = useNearbyActivities();

  return (
    <div className="w-full overflow-x-hidden">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative min-h-screen text-white flex flex-col justify-between"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/hero2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* ================= HERO CONTENT ================= */}
        <div className="relative z-30 flex-1 flex items-center justify-center px-6 mt-20">
          <div className="text-center max-w-3xl w-full">
            <h1 className="text-2xl md:text-2xl font-bold leading-tight">
              Step outside.
              <br />
              Meet reality.
              <br />
              Create memories.
            </h1>

            <p className="mt-5 text-lg md:text-xl text-gray-200">
              Discover nearby activities. Hike, An indoor game, Sight-seeing. Any group activity.
              Step out of your home and into real experiences.
            </p>

            {/* SEARCH + CREATE (SAME ROW) */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <div className="
                  w-full sm:w-auto
                  flex justify-center
                  bg-white/95 backdrop-blur-md
                  p-3 rounded-xl shadow-lg text-black
                ">
                <SearchAutocomplete />
              </div>

              <button
                onClick={() => navigate("/activities/create")}
                className="
                  px-6 py-3 bg-green-700 hover:bg-green-800
                  rounded-xl text-lg font-semibold
                  whitespace-nowrap
                "
              >
                Create Activity
              </button>
            </div>
          </div>
        </div>

        {/* ================= ACTIVITY CAROUSEL ================= */}
      <div className="relative z-20 w-full mt-3">
        <div className="bg-black/15 backdrop-blur-md px-4 pt-3 pb-2">
          <h3 className="text-sm font-semibold mb-4">
            Activities near you
          </h3>

          {loading ? (
            <p className="text-sm text-gray-300">Loading activities…</p>
          ) : activities.length === 0 ? (
            <p className="text-sm text-gray-300">
              No activities yet. Be the first to create one.
            </p>
          ) : (
            <div className="relative">
              {/* SCROLL CONTAINER */}
              <div
                id="landing-activity-carousel"
                className="
                  flex items-center gap-6
                  overflow-x-auto overflow-y-hidden
                  scroll-smooth snap-x snap-mandatory
                  hide-scrollbar
                  touch-pan-x
                "
                style={{ height: "300px" }}
              >
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="snap-start shrink-0 flex items-center"
                    style={{ width: "280px", height: "100%" }}
                  >
                    <div className="w-full h-full flex items-end">
                      <ActivityCard activity={activity} />
                    </div>
                  </div>
                ))}
              </div>

              {/* LEFT ARROW */}
              <button
                onClick={() => {
                  const el = document.getElementById("landing-activity-carousel");
                  el?.scrollBy({ left: -280, behavior: "smooth" });
                }}
                className="
                  absolute left-1 top-1/2 -translate-y-1/2
                  bg-black/70 hover:bg-black
                  text-white p-2 rounded-full
                  backdrop-blur z-30
                "
                aria-label="Scroll left"
              >
                ◀
              </button>

              {/* RIGHT ARROW */}
              <button
                onClick={() => {
                  const el = document.getElementById("landing-activity-carousel");
                  el?.scrollBy({ left: 280, behavior: "smooth" });
                }}
                className="
                  absolute right-1 top-1/2 -translate-y-1/2
                  bg-black/70 hover:bg-black
                  text-white p-2 rounded-full
                  backdrop-blur z-30
                "
                aria-label="Scroll right"
              >
                ▶
              </button>

              {/* GRADIENT FADES (VISUAL ONLY) */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black/80 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black/80 to-transparent" />
            </div>
          )}
        </div>
      </div>

        
    </section>

      {/* ================= FLOATING CONTENT ================= */}
      <section
        className="relative py-24 px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/images/hero1.jpg')",
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

        {/* HOW IT WORKS */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="rounded-3xl bg-white shadow-xl p-10 md:p-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              How it works
            </h2>

            <div className="grid md:grid-cols-4 gap-10 text-center">
              <div>
                <span className="text-3xl">📍</span>
                <h4 className="mt-4 font-semibold text-lg">Discover</h4>
                <p className="mt-2 text-gray-600">
                  Browse activities happening near you.
                </p>
              </div>

              <div>
                <span className="text-3xl">➕</span>
                <h4 className="mt-4 font-semibold text-lg">Join or Create</h4>
                <p className="mt-2 text-gray-600">
                  Join instantly or host your own activity.
                </p>
              </div>

              <div>
                <span className="text-3xl">💬</span>
                <h4 className="mt-4 font-semibold text-lg">
                  Coordinate with Group Chat
                </h4>
                <p className="mt-2 text-gray-600">
                  Chat, plan, and stay updated in one place.
                </p>
              </div>

              <div>
                <span className="text-3xl">🌍</span>
                <h4 className="mt-4 font-semibold text-lg">
                  Live Location Sharing
                </h4>
                <p className="mt-2 text-gray-600">
                  Optional live location sharing for outdoor activities.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA CARD */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-white shadow-xl p-12 text-center overflow-hidden">
            <h2 className="text-3xl font-bold">
              Your city is full of life.
            </h2>
            <p className="mt-4 text-gray-600 text-lg">
              You just need a reason to step out.
            </p>

            <button
              onClick={() => navigate("/home")}
              className="mt-8 px-8 py-3 bg-black text-white rounded-lg text-lg hover:bg-gray-800"
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
