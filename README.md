# Kuvaus

An activity tracker for multiple users.

Myös palautusrepo HY:n [kurssille](https://cybersecuritybase.mooc.fi/module-3.1).
Tavoitteena on sisältää ainakin 5kpl haavoittuvuutta [OWASP:in 2021 listalta](https://owasp.org/www-project-top-ten/).

## Apu tarkastajille

Aja alla komentoja saadaksesi toimimaan projektin Linux koneellasi:

```bash
git clone https://github.com/tomjtoth/events
cd events
echo "JWT_SECRET=$(uuidgen)" > .env
npm install
npm run dev
```

Essee löytyy [täältä](./essay.md).
