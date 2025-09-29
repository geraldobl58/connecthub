import Link from "next/link";

const MarketingPage = () => {
  return (
    <div>
      <h1>Marketing</h1>
      <ul>
        <li>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </li>
      </ul>
    </div>
  );
};

export default MarketingPage;
