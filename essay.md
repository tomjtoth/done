LINK: https://github.com/tomjtoth/events

Installation instructions are included in the repo's README.md. Since fixing vulnerabilities sometimes require changes in many different parts of the codebase, I ended up implementing "vulnerability toggles" (after feature-toggles) in order to present a centralized fix for vulnerabilities [SW] and ease of testing for reviewers of this repo. In certain cases I have not referenced the exact location of a vulnerability, you will need to search for their toggle's name in the source code to find all affected chunks of code.
For clarity, throughout the essay I'll use the phrase "vulnerability fixed", meaning it's toggle is set to `false` in [SW].

FLAW 1:

A clear case of "violation of the principle of least privilege or deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone." [A01]

Creating new events is not really productive by default: the user has to select the creator users's id from an html select tag [A01-before1], making it possible for any user to assign a new event to any other user. To make things worse, an active user session (logging in) is not even necessary for the event to be successfully created, any anonymous visitor can do so. This behavior is not desirable.

After fixing this vulnerability, the related view [A01-after2] would not list users any longer, and the related logic [A01cd] retrieves the current user's id from the active session and assigns it to the created event as the owner. Furthermore, without a valid session, any anonymous visitor gets redirected to the `/login` page from the event creation view. The same goes for deletion of events, there's an additional check for an active user session before even rendering the delete button [A01-after3] and the same check is done before attempting to delete [A01cd2].

FLAW 2:

"Is encryption not enforced, e.g., are any HTTP headers (browser) security directives or headers missing?" [A02]

Upon a successful login, the id, name and email of the user (the whole user row really, except for the password hash) are sent back to the client in plain text (serialized JSON format) via setting a cookie called "session" [A02cd1]. This cookie is then used on the frontend to render the logged-in user's name next to the logout button and throughout the backend to resolve the identity of the current user.

Once this vulnerability is fixed, the server will append an additional property - using JSON web token - named "token" to the object to be serialized. This JWT holds exactly the same data, as the original object. While this vulneravility is fixed, during the creation [A02cd2] and deletion [A02cd3] of events the server will resolve `user_id` from the encrypted token rather than plain text, which is susceptible to client side manipulation.

This vulnerability requires A01 to be fixed as well, otherwise testing it is rather impossible. Also, it is vital to re-login (the client receives the jwt from the server) every time the toggle is set to `false`. Otherwise the server would most probably fail with an Internal Server error (500) while trying to read a non-existent token's `id` property. This case is out of the scope of the assignment.

FLAW 3:

"Hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures." [A03]

Since by default the event creation form simply concatenates the user input [A03code], a malicious user might alter some other user's name by creating an event with the following content in the description field: `description of new event'); update users set name='user1 got hacked' where id=1; --`. Before [A03-before] and after [A03-after] the prank.

After fixing this vulnerability, the same trick doesn't work anymore. The logic rather uses a different method, that's actually meant for handling user input instead of the original script execution method of the database connection. Simply changing between the two methods would perhaps suffice in this scenario, but going one step further I added a dependency that's dedicated to user input sanitizization and supports ES6 tagged template strings as a bonus.

FLAW 4:

"Permits default, weak, or well-known passwords, such as "Password1" or "admin/admin"." [A07]

The fix for this one is quite oversimplified, I ended up doing as OWASP suggests: "Implement weak password checks, such as testing new or changed passwords against the top 10,000 worst passwords list" [A07]. I was originally looking for a free online dictionary API that supports the Finnish language as well, but have not found any. The final solution [A07cd1] would not allow the creation of a user with matching password and email fields or matching password and username values and checks the lower-case converted password against the OWASP 10k worst passwords list. This solution could further expand on deploying multi-factor authentication, but I had no previous experience with it.

FLAW 5:

"Auditable events, such as logins, failed logins, and high-value transactions, are not logged." [A09]

This vulnerability is kind of omni-present throughout the codebase. Simply search for "A09_2021" to find all of its occurences. Upon fixing it, each of the following events get verbosely logged:

- user logged in
- user registration
- user logged out
- event creation
- event deletion

References:

[SW] https://github.com/tomjtoth/done/blob/main/src/lib/vulnerabilities.ts

[A01] https://owasp.org/Top10/A01_2021-Broken_Access_Control/  
[A01vw] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts  
[A01vw2] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts  
[A01vw3] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts  
[A01cd] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts  
[A01cd2] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts

[A02] https://owasp.org/Top10/A02_2021-Cryptographic_Failures/  
[A02cd1] jwt.sign-part-of-the-login-process  
[A02cd2] createEvent-A02-switch  
[A02cd3] deleteEvent-A02-switch

[A03] https://owasp.org/Top10/A03_2021-Injection/  
[A03code] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts#L26

[A07] https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/  
[A07cd1] asdf

[A09] https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/
