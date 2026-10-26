import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Reachdesk - Email & WhatsApp Marketing Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Dynamic OpenGraph Image Generator.
 * Creates an on-brand 1200x630 social card for search engine crawlers and social shares.
 */
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundColor: "#0B0914",
        padding: "60px 80px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Glow accent */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(134, 70, 216, 0.45) 0%, transparent 70%)",
        }}
      />

      {/* Top Header: Logo + Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #8646D8 0%, #5F29A3 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{ fontSize: "28px", fontWeight: "900", color: "#FFFFFF" }}
          >
            R
          </span>
        </div>
        <span
          style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: "-0.5px",
          }}
        >
          Reachdesk
        </span>
        <span
          style={{
            marginLeft: "12px",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#BD9AE8",
            backgroundColor: "rgba(134, 70, 216, 0.18)",
            border: "1px solid rgba(134, 70, 216, 0.35)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Omnichannel Marketing
        </span>
      </div>

      {/* Center: Main Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "950px",
        }}
      >
        <div
          style={{
            fontSize: "62px",
            fontWeight: "900",
            color: "#FFFFFF",
            lineHeight: 1.15,
            letterSpacing: "-2px",
          }}
        >
          Turn Your Contacts into Customers
        </div>
        <p
          style={{
            fontSize: "23px",
            fontWeight: "400",
            color: "#CBD5E1",
            lineHeight: 1.4,
            maxWidth: "850px",
            margin: 0,
          }}
        >
          Create, manage, and automate high-converting email and verified
          WhatsApp campaigns from one powerful workspace.
        </p>
      </div>

      {/* Bottom Bar: Feature Badges & URL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
              }}
            />
            <span
              style={{ fontSize: "16px", fontWeight: "600", color: "#E2E8F0" }}
            >
              WhatsApp Business API
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#8646D8",
              }}
            />
            <span
              style={{ fontSize: "16px", fontWeight: "600", color: "#E2E8F0" }}
            >
              Email Campaigns
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#38BDF8",
              }}
            />
            <span
              style={{ fontSize: "16px", fontWeight: "600", color: "#E2E8F0" }}
            >
              Real-Time Analytics
            </span>
          </div>
        </div>

        <span style={{ fontSize: "17px", fontWeight: "700", color: "#94A3B8" }}>
          reachdesk.broteens.com
        </span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
