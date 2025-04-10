LINK: https://github.com/tomjtoth/done

Since the vulnerabilities are intertwined, I ended up implementing "vulnerability toggles" in order to present a fix for an issue at hand.

FLAW 1:

"Hostile data is directly used or concatenated. The SQL or command contains the structure and malicious data in dynamic queries, commands, or stored procedures." [1]

Since the event creation form simply concatenates the user input [2], a malicious user might alter some other user's name by creating an event with the following content in the description field: `description of new event'); update users set name='pwned' where id=1; --`. After toggling the vulnerability to `false` in [3], the same trick doesn't work anymore.

FLAW 2:
handling something via `GET /users/2?new_password=qqq&password_confirm=qqq` when it clearly should be handled via a POST request

FLAW 3:
in case of 2 users, the first user can delete the 2nd user via submitting `DELETE /users/2`

FLAW 4:
Permits default, weak, or well-known passwords, such as "Password1" or "admin/admin".

FLAW 5:
"Auditable events, such as logins, failed logins, and high-value transactions, are not logged."

[1] https://owasp.org/Top10/A03_2021-Injection/
[2] url to the event creation form
[3] url to A03_switch

[_] https://owasp.org/Top10/A02_2021-Cryptographic_Failures/

[_] https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/

[_] https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/
