LINK: https://github.com/tomjtoth/done

FLAW 1: https://owasp.org/Top10/A01_2021-Broken_Access_Control/
in case of 2 users, the first user can delete the 2nd user via submitting `DELETE /users/2`

FLAW 2: https://owasp.org/Top10/A02_2021-Cryptographic_Failures/
handling something via `GET /users/2?new_password=qqq&password_confirm=qqq` when it clearly should be handled via a POST request

FLAW 3: https://owasp.org/Top10/A03_2021-Injection/
https://www.npmjs.com/package/sqlite#es6-tagged-template-strings
have to build some raw query, like `select * from activities where user_id == ${variable}`
...

FLAW 4: https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/
Permits default, weak, or well-known passwords, such as "Password1" or "admin/admin".

FLAW 5: https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/
"Auditable events, such as logins, failed logins, and high-value transactions, are not logged."
