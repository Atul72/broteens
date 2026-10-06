import Icon from "./icon";

export default function Navbar() {
  return (
    <header className="flex h-[72px] items-center justify-between border-b border-[#e2e7ef] bg-white px-5 md:h-[88px] md:px-[5%]">
      <a
        href="#top"
        className="flex items-center gap-[11px] text-[19px] font-bold tracking-[-0.6px] md:text-[22px]"
      >
        <span className="grid h-[33px] w-[33px] place-items-center rounded-xl bg-[#ffbf24] md:h-[38px] md:w-[38px]">
          <Icon name="trend" className="h-[22px] w-[22px]" />
        </span>
        Broteens
        <span className="ml-1 hidden text-[10px] font-medium tracking-[1.8px] text-[#8a93a3] md:inline">
          ALERTS
        </span>
      </a>

      {/* <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-9 text-sm font-semibold md:flex"
            >
              <a
                href="#top"
                className="relative py-[34px] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-[#ffbf24]"
              >
                Overview
              </a>
              <a href="#watch" className="text-[#65718a] hover:text-[#080e20]">
                My watchlist
              </a>
              <a href="#insight" className="text-[#65718a] hover:text-[#080e20]">
                Shopping insights
              </a>
            </nav> */}

      <div className="flex items-center gap-5">
        {/* <button
                type="button"
                aria-label="Notifications"
                className="hidden rounded-lg p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309] md:block"
              >
                <Icon name="bell" />
              </button> */}
        <a
          href="/settings"
          aria-label="Open profile settings"
          className="grid h-10 w-10 place-items-center rounded-full bg-[#eef1f6] text-[13px] font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309]"
        >
          AR
        </a>
      </div>
    </header>
  );
}
