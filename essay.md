LINK: https://github.com/tomjtoth/events

Installation instructions are included in the repo's README.md. Since fixing vulnerabilities sometimes require changes in many different parts of the codebase, I ended up implementing "vulnerability toggles" (after feature-toggles) in order to present a centralized fix for vulnerabilities [1] and ease of testing for reviewers of this repo. In certain cases I have not referenced the exact location of a vulnerability, you will need to search for their toggle's name in the source code to find all affected chunks of code.
For clarity, throughout the essay I'll use the phrase "vulnerability fixed", meaning it's toggle is set to `false` in [1].

FLAW 1:

A clear case of "violation of the principle of least privilege or deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone." [2]

Creating new events is not really productive by default: the user has to select the creator users's id from an html select tag [3][4][5], making it possible for any user to assign a new event to any other user. To make things worse, an active user session (logging in) is not even necessary for the event to be successfully created, any anonymous visitor can do so. This behavior is not desirable.

After fixing this vulnerability, the related view [6][7] would not list users any longer [3], and the related server-side logic [8] retrieves the current user's id from the active session and assigns it to the created event as the owner. Furthermore, without a valid session, any anonymous visitor gets redirected to the `/login` page from the event creation view. The same goes for deletion of events, there's an additional check for an active user session before even rendering the delete button [9][10] and the same check is done before attempting to delete [11].

FLAW 2:

"Is encryption not enforced, e.g., are any HTTP headers (browser) security directives or headers missing?" [12]

Upon a successful login, the id, name and email of the user (the whole user row really, except for the password hash) are sent back to the client in plain text (serialized JSON format) via setting a cookie called "session" [13][14]. This cookie is then used on the front-end to render the logged-in user's name next to the logout button [15] and throughout the back-end to resolve the identity of the current user.

Once this vulnerability is fixed, the server will append an additional property - using JSON web token - named "token" to the object to be serialized [16]. This JWT holds exactly the same data, as the original object. While this vulnerability is fixed, during the creation [8] and deletion [17] of events, the server will resolve the user's id from the encrypted token rather than plain text, which is susceptible to client side manipulation.

In order to test this vulnerability A01 is required to be fixed as well. Furthermore, it is vital to re-login (the client receives the jwt from the server) every time the toggle is set to `false`. Otherwise the server would most probably fail with an Internal Server error (500) while trying to read a non-existent token's id property. This case is out of the scope of the assignment.

FLAW 3:

"Hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures." [18]

Since by default the event creation form simply concatenates the user input [19], a malicious user might alter some other user's name by creating an event with the following content in the description field: `description of new event'); update users set name='user1 got hacked' where id=1; --` [20][21].

After fixing this vulnerability, the same trick doesn't work anymore [22][23]. The logic [24] rather uses a different method, that's actually meant for handling user input instead of the original script execution method of the database connection. Simply changing between the two methods would perhaps suffice in this scenario, but going one step further I added a dependency that's dedicated to user input sanitizization and supports ES6 tagged template strings as a bonus.

FLAW 4:

"Permits default, weak, or well-known passwords, such as "Password1" or "admin/admin"." [25]

The fix for this one is quite oversimplified, I ended up doing as OWASP suggests: "Implement weak password checks, such as testing new or changed passwords against the top 10,000 worst passwords list" [25]. I was originally looking for a free online dictionary API that supports the Finnish language as well, but have not found any. The final solution [26] would not allow the creation of a user with matching password and email fields or matching password and username values and checks the lower-case converted password against the OWASP 10k worst passwords list. This solution could further expand on deploying multi-factor authentication, but I had no previous experience with it.

FLAW 5:

"Auditable events, such as logins, failed logins, and high-value transactions, are not logged." [27]

This vulnerability is kind of omni-present throughout the codebase. Simply search for "A09_2021" to find all of its occurences. Upon fixing it, each of the following events get verbosely logged:

- user logged in
- user registration
- user logged out
- event creation
- event deletion

References:

[1] https://github.com/tomjtoth/done/blob/main/src/lib/vulnerabilities.ts  
[2] https://owasp.org/Top10/A01_2021-Broken_Access_Control/  
[3] https://github.com/tomjtoth/events/blob/main/src/app/events/new/page.tsx#L20  
[4] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-1-before-1.png  
[5] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-1-before-2.png  
[6] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-1-after-1.png  
[7] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-1-after-2.png  
[8] https://github.com/tomjtoth/events/blob/main/src/lib/actions/events.ts#L35  
[9] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-1-before-3.png  
[10] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-1-after-3.png  
[11] https://github.com/tomjtoth/events/blob/main/src/app/events/%5Bid%5D/page.tsx#L27  
[12] https://owasp.org/Top10/A02_2021-Cryptographic_Failures/  
[13] https://github.com/tomjtoth/events/blob/main/src/lib/actions/users.ts#L97-L104  
[14] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-2-before-1.png  
[15] https://github.com/tomjtoth/events/blob/main/src/app/layout.tsx#L60  
[16] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-2-after-1.png  
[17] https://github.com/tomjtoth/events/blob/main/src/lib/actions/events.ts#L99  
[18] https://owasp.org/Top10/A03_2021-Injection/  
[19] https://github.com/tomjtoth/events/blob/main/src/lib/actions/events.ts#L43-L46  
[20] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-3-before-1.png  
[21] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-3-before-2.png  
[22] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-3-after-1.png  
[23] https://github.com/tomjtoth/events/blob/main/screenshots/flaw-3-after-2.png  
[24] https://github.com/tomjtoth/events/blob/main/src/lib/actions/events.ts#L49-L52  
[25] https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/  
[26] https://github.com/tomjtoth/events/blob/main/src/lib/actions/users.ts#L43-L54  
[27] https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/
