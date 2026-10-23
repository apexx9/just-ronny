import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-code">404 · Page not found</p>
        <h1 className="not-found-title">Wrong turn.</h1>
        <p className="not-found-description">
          This page doesn&apos;t exist or may have moved. Let&apos;s get you back
          to something that does.
        </p>
        <div className="not-found-actions">
          <Link className="pill-button primary-button" href="/">
            Back home
          </Link>
          <Link className="pill-button" href="/#work">
            See selected work
          </Link>
        </div>
      </div>
    </main>
  );
}
