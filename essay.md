LINK: https://github.com/tomjtoth/done

Installation instructions are included in the repo's README.md. Since fixing vulnerabilities sometimes require changes in different parts of the codebase, I ended up implementing "vulnerability toggles" (after feature-toggles) in order to present a centralized fix for vulnerabilities [SW]. Wherever I have not referenced the exact location of a vulnerability, you will need to search for its toggle's name in the source code to find all affected chunks of code.

FLAW 1:

"Hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures." [A03]

Since the event creation form simply concatenates the user input [2], a malicious user might alter some other user's name by creating an event with the following content in the description field: `description of new event'); update users set name='pwned' where id=1; --`. After toggling the vulnerability to `false` in [A03code], the same trick doesn't work anymore.

FLAW 2:

A clear case of "violation of the principle of least privilege or deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone." [A01]

Creating new events is not really productive by default: a user has to select the creator users's id from an html select tag [A01vw], making it possible for a user to create an event with an owner of a different user. Furthermore an active user session is not even necessary for the event to be successfully created, any anonymous visitor can do so.
However, after setting this vulnerability's toggle to `false` in [SW], the related view [A01vw] wouldn't list users any longer, the related logic [A01cd] retrieves the current user's id from the active session and assigns it to the created event as `user_id`. Without a valid session, any visitor gets redirected to the `/login` page. The same goes for deletion of events, there's an additional check for an active user session before even rendering the delete button [A01vw2] and the same check is done before attempting to delete [A01cd2].

FLAW 3:

"Is encryption not enforced, e.g., are any HTTP headers (browser) security directives or headers missing?" [A02]

Upon a successful login, the id, name and email of the user (the whole user row really, except for the password hash) are sent back to the client in plain text via setting a cookie [A02cd1]. This cookie is used throughout the app to resolve the identity of the "current user".

It is vital that you delete the session (or logout) prior to toggling this vulnerability's switch during your inspection of the codebase. Otherwise the server would expect the session cookie to be plain text while it's encrypted and vice versa. This scenario would cause unrelated failures.

Once this vulnerability is turned off, the server will append an addition "token" named property (using JSON web token) to the serialized object in addition to plain text. While this vulneravility is turned off, during the creation [A02cd2] and deletion [A02cd3] of events the server will resolve user_id from the encrypted token rather than plain text, which is susceptible to manipulation.

This vulnerability requires A01 to be disabled [SW] as well, otherwise testing it is rather impossible.

FLAW 4:
Permits default, weak, or well-known passwords, such as "Password1" or "admin/admin".

FLAW 5:

"Auditable events, such as logins, failed logins, and high-value transactions, are not logged." [A09]

This vulnerability is present in many places throughout the codebase. Simply search for "A09_2021" to find all of its occurences. Upon turning off this vulnerability in [SW] each of the following events get verbosely logged: user login, creation, logout; event creation & deletion.

[SW] https://github.com/tomjtoth/done/blob/main/src/lib/vulnerabilities.ts
[A03] https://owasp.org/Top10/A03_2021-Injection/
[A03code] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts#L26

[A01] https://owasp.org/Top10/A01_2021-Broken_Access_Control/
[A01vw] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts
[A01cd] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts
[A01vw2] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts
[A01cd2] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts

[A02] https://owasp.org/Top10/A02_2021-Cryptographic_Failures/
[A02cd1] jwt.sign part of the login process
[A02cd2] createEvent A02 switch
[A02cd3] deleteEvent A02 switch

[A07] https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

[A09] https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/
