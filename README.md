# Kuvaus

Tämä web-sovellus on palautus HY:n [kurssille](https://cybersecuritybase.mooc.fi/module-3.1), sisältää 5kpl haavoittuvuutta [OWASP:in 2021 listalta](https://owasp.org/www-project-top-ten/) ja on deplattu [tänne](https://events.ttj.hu).

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
