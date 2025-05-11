import { A01_2021, A02_2021, A03_2021, A09_2021 } from "@/lib/vulnerabilities";

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
              might alter some other user&apos;s name by creating an event with
              the following content in the description field:{" "}
              <code>
                description of new event&apos;); update users set
                name=&apos;pwned&apos; where id=1; --
              </code>
            </p>
          </li>
        )}
        {A01_2021 && (
          <li>
            <h4>A01 - OWASP 2021</h4>
            <p>
              Creating events and assigning other users as owners is currently
              possible, actually it doesn&apos;t even require an active user
              session, so an anonymous visitor can also create events in the
              system, which is undesirable.
            </p>
          </li>
        )}
        {A02_2021 && (
          <li>
            <h4>A02 - OWASP 2021</h4>
            <p>
              The &quot;session&quot; named cookie contains the current
              user&apos;s ID in plain text, which can be modified in order to
              fake user identity during event creation and deletion (provided{" "}
              <code>A01_2021</code> is already turned off).
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
