"use client";

// Components
import HomePageIntro from "./_components/home-page-intro";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import FeatureTip from "./_components/feature-tip";
import AlertForm from "./_components/product-alert-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f5fa] text-[#080e20]">
      <Navbar />
      <main
        id="top"
        className="mx-auto max-w-[1352px] px-[18px] py-7 md:px-7 md:py-8"
      >
        <HomePageIntro />

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)]">
          <AlertForm />

          {/* Sidebar with feature tips */}

          <aside className="hidden flex-col gap-5 md:flex">
            <section className="rounded-[20px] border border-[#e2e7ef] bg-white px-[25px] py-[23px]">
              <h3 className="mb-4 text-base font-bold tracking-[-0.2px]">
                Made for your kind of shopping.
              </h3>
              <FeatureTip
                icon="clock"
                title="A schedule that suits you"
                description="From hourly checks to a daily update."
              />
              <FeatureTip
                icon="filter"
                title="Updates that matter"
                description="Choose a target, any drop, or every check."
              />
              <FeatureTip
                icon="pause"
                title="Always under your control"
                description="Pause a watch when you’re done shopping."
              />
            </section>
          </aside>
        </div>
        <Footer />
      </main>
    </div>
  );
}
