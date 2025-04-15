LINK: https://github.com/tomjtoth/done

Installation instructions are included in the repo's README.md. Since fixing vulnerabilities sometimes require changes in different parts of the codebase, I ended up implementing "vulnerability toggles" (after feature-toggles) in order to present a centralized fix for vulnerabilities [SW]. Wherever I have not referenced the exact location of a vulnerability, you will need to search for its toggle's name in the source code to find all all affected chunks of code.

FLAW 1:

"Hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures." [A03]

Since the event creation form simply concatenates the user input [2], a malicious user might alter some other user's name by creating an event with the following content in the description field: `description of new event'); update users set name='pwned' where id=1; --`. After toggling the vulnerability to `false` in [A03code], the same trick doesn't work anymore.

FLAW 2:

"Violation of the principle of least privilege or deny by default, where access should only be granted for particular capabilities, roles, or users, but is available to anyone." [A01]

make it so, that the event of user 1 can be edited by user 2

FLAW 3:
in case of 2 users, the first user can delete the 2nd user via submitting `DELETE /users/2`

FLAW 4:
Permits default, weak, or well-known passwords, such as "Password1" or "admin/admin".

FLAW 5:

"Auditable events, such as logins, failed logins, and high-value transactions, are not logged." [A09]

Before flipping the switch in [SW] none of the following events are logged: user login, user creation, user logout, event creation.

[SW] https://github.com/tomjtoth/done/blob/main/src/lib/vulnerabilities.ts
[A03] https://owasp.org/Top10/A03_2021-Injection/
[A03code] https://github.com/tomjtoth/done/blob/main/src/lib/actions/events.ts#L26

[A02] https://owasp.org/Top10/A02_2021-Cryptographic_Failures/

[A07] https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

[A09] https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/
