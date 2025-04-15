import { A03_2021, A09_2021 } from "@/lib/vulnerabilities";

export default function Home() {
  return (
    <>
      <p className="m-2">
        This is a{" "}
        <s>
          multi-user activity tracker to get things <em>done</em>
        </s>{" "}
        fake app for a course at the University of Helsinki, use at your own
        risk!
      </p>
      <ul>
        {A03_2021 && (
          <li>
            <h4>A03 - OWASP 2021</h4>
            <p>
              SQL injection is currently possible on this site: a malicious user
              might alter some other user's name by creating an event with the
              following content in the description field:{" "}
              <code className="bg-gray-300 font-mono text-lg">
                description of new event'); update users set name='pwned' where
                id=1; --
              </code>
            </p>
          </li>
        )}
        {A09_2021 && (
          <li>
            <h4>A09 - OWASP 2021</h4>
            <p>
              Currently logging critical events is disabled throughout the
              software.
            </p>
          </li>
        )}
      </ul>
    </>
  );
}
