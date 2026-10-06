import { type FormEvent, useEffect, useRef, useState } from "react";

import Icon from "./icon";

type Channel = "email" | "sms";

interface SuccessDetails {
  message: string;
  delivery: string;
  schedule: string;
}

const inputClass =
  "h-12 w-full min-w-0 rounded-[10px] border border-[#dbe1eb] bg-white px-3.5 text-sm text-[#080e20] outline-none transition placeholder:text-[#8993a5] focus:border-[#8993a5] focus:ring-2 focus:ring-[#080e20]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309]";

export default function AlertForm() {
  const [hours, setHours] = useState(6);
  const [channels, setChannels] = useState<Channel[]>(["email"]);
  const [trigger, setTrigger] = useState("target");
  const [productUrl, setProductUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [linkResult, setLinkResult] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessDetails | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);

  const triggerHelp =
    trigger === "target"
      ? "Alerts only when your target is reached."
      : trigger === "drop"
        ? "Alerts when the price drops."
        : "You’ll receive an update after every check.";

  useEffect(() => {
    if (!success) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    doneButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSuccess(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [success]);

  const frequencyLabel = hours === 24 ? "day" : `${hours} hours`;

  function validateProductUrl(): URL | null {
    try {
      const parsed = new URL(productUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      setUrlError(null);
      return parsed;
    } catch {
      setLinkResult(null);
      setUrlError("Enter a valid http or https product URL.");
      return null;
    }
  }

  // Check the product URL and update the link result state
  function checkLink() {
    const parsed = validateProductUrl();
    if (!parsed) return;
    setLinkResult(
      `Valid URL format · ${parsed.hostname} · Product lookup is not connected in this preview.`,
    );
  }

  // Toggle the selection of a notification channel (email or SMS)
  function toggleChannel(channel: Channel) {
    setChannels((current) =>
      current.includes(channel)
        ? current.filter((item) => item !== channel)
        : [...current, channel],
    );
    setFormError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Implement form submission logic here, such as sending data to a server or updating state.
    // For this example, we'll just simulate a successful submission.
    setSuccess({
      message: "Your price alert has been created successfully!",
      delivery: channels.join(", "),
      schedule: `Every ${frequencyLabel}`,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[17px] border border-[#e2e7ef] bg-white px-[18px] py-[22px] md:rounded-[20px] md:px-[30px] md:py-7"
    >
      <div>
        <h2 className="text-[19px] font-bold tracking-[-0.5px] md:text-xl">
          Create a price alert
        </h2>
      </div>
      <p className="mt-1.5 text-xs leading-5 text-[#65718a] md:text-[13px]">
        One product link. Your rules. Better timing.
      </p>

      <div className="mt-[22px] md:mt-6">
        <label
          htmlFor="product-url"
          className="mb-2.5 block text-xs font-semibold md:text-[13px]"
        >
          <span className="mr-2 rounded-[5px] bg-[#f0f3f8] px-1.5 py-1 text-[10px] text-[#626f87]">
            01
          </span>
          What are you keeping an eye on?
        </label>
        <div className="flex flex-col gap-[9px] md:flex-row">
          <input
            id="product-url"
            type="url"
            value={productUrl}
            onChange={(event) => {
              setProductUrl(event.target.value);
              setUrlError(null);
              setLinkResult(null);
            }}
            placeholder="Paste a product link here"
            required
            aria-describedby="product-url-help product-url-status"
            aria-invalid={Boolean(urlError)}
            className={inputClass}
          />
          <button
            type="button"
            onClick={checkLink}
            className="h-10 whitespace-nowrap rounded-[10px] bg-[#080e20] px-[22px] text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309] md:h-12"
          >
            Check link <span className="ml-2">↗</span>
          </button>
        </div>
        <p
          id="product-url-help"
          className="mt-2 text-[11px] leading-5 text-[#65718a]"
        >
          Use the product page URL, including your chosen size or variant.
        </p>
        <div id="product-url-status" aria-live="polite">
          {urlError ? (
            <p className="mt-2 text-xs text-[#b33636]">{urlError}</p>
          ) : null}
          {linkResult ? (
            <p className="mt-2 text-xs text-[#14785c]">{linkResult}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-[22px] md:mt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="trigger"
              className="mb-2.5 block text-xs font-semibold md:text-[13px]"
            >
              <span className="mr-2 rounded-[5px] bg-[#f0f3f8] px-1.5 py-1 text-[10px] text-[#626f87]">
                02
              </span>
              When should we notify you?
            </label>
            <select
              id="trigger"
              value={trigger}
              onChange={(event) => setTrigger(event.target.value)}
              className={inputClass}
            >
              <option value="target">Price reaches my target</option>
              <option value="drop">Any price drop</option>
              <option value="every">Every scheduled check</option>
            </select>
          </div>
          {trigger === "target" ? (
            <div>
              <label
                htmlFor="target-price"
                className="mb-2.5 block text-xs font-semibold md:text-[13px]"
              >
                Your target price
              </label>
              <input
                id="target-price"
                type="number"
                min="1"
                step="0.01"
                value={targetPrice}
                onChange={(event) => setTargetPrice(event.target.value)}
                placeholder="₹  Enter amount"
                required
                className={inputClass}
              />
            </div>
          ) : null}
        </div>
      </div>

      <fieldset className="mt-[22px] md:mt-6">
        <legend className="mb-2.5 text-xs font-semibold md:text-[13px]">
          <span className="mr-2 rounded-[5px] bg-[#f0f3f8] px-1.5 py-1 text-[10px] text-[#626f87]">
            03
          </span>
          How often should we check?
        </legend>
        <div className="flex gap-[5px] md:gap-2">
          {[1, 3, 6, 12, 24].map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={hours === option}
              onClick={() => setHours(option)}
              className={`h-11 min-w-0 flex-1 rounded-[9px] border text-[11px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309] md:text-[13px] ${
                hours === option
                  ? "border-[#e3ac1a] bg-[#fff7df]"
                  : "border-[#e2e7ef] bg-white"
              }`}
            >
              {option === 24
                ? "1 day"
                : `${option} hour${option === 1 ? "" : "s"}`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-5 text-[#65718a]">
          Checks every {frequencyLabel}. {triggerHelp}
        </p>
      </fieldset>

      <fieldset className="mt-[22px] md:mt-6">
        <legend className="mb-2.5 text-xs font-semibold md:text-[13px]">
          <span className="mr-2 rounded-[5px] bg-[#f0f3f8] px-1.5 py-1 text-[10px] text-[#626f87]">
            04
          </span>
          Where should we send your updates?
        </legend>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {(
            [
              ["email", "Email", "Sent to your inbox", "mail"],
              ["sms", "SMS", "Sent to your phone", "message"],
            ] as const
          ).map(([channel, label, description, icon]) => {
            const selected = channels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleChannel(channel)}
                className={`flex items-center gap-[7px] rounded-[10px] border px-[9px] py-[11px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309] md:gap-2.5 md:p-[13px] ${
                  selected
                    ? "border-[#d8a21b] bg-[#fffbf0]"
                    : "border-[#e2e7ef] bg-white"
                }`}
              >
                <span
                  className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border text-xs ${
                    selected
                      ? "border-[#080e20] bg-[#080e20] text-white"
                      : "border-[#cbd2df]"
                  }`}
                >
                  {selected ? "✓" : null}
                </span>
                <span>
                  <strong className="block text-[13px]">{label}</strong>
                  <small className="mt-1 block text-[10px] text-[#65718a] md:text-[11px]">
                    {description}
                  </small>
                </span>
                <Icon name={icon} className="ml-auto hidden h-5 w-5 md:block" />
              </button>
            );
          })}
        </div>

        {channels.includes("email") ? (
          <input
            type="email"
            placeholder="you@example.com"
            aria-label="Notification email address"
            required
            className={`${inputClass} mt-2.5`}
          />
        ) : null}
        {channels.includes("sms") ? (
          <input
            type="tel"
            placeholder="+91  Enter mobile number"
            aria-label="SMS phone number"
            pattern="\+?[0-9 ()-]{10,18}"
            required
            className={`${inputClass} mt-2.5`}
          />
        ) : null}
        <p className="mt-2 text-[11px] leading-5 text-[#65718a]">
          Choose one or both. Verify details before delivery.
        </p>
      </fieldset>

      {formError ? (
        <p role="alert" className="mt-2 text-xs text-[#b33636]">
          {formError}
        </p>
      ) : null}
      <button
        ref={submitButtonRef}
        type="submit"
        className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-[10px] bg-[#ffbf24] px-[22px] text-sm font-semibold text-[#080e20] transition hover:bg-[#f3b315] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b38309]"
      >
        Create price alert <span className="text-[19px]">→</span>
      </button>
      <p className="mt-2.5 text-center text-[10px] leading-5 text-[#65718a] md:text-[11px]">
        You’re in control. Edit, pause, or remove an alert anytime.
      </p>
    </form>
  );
}
