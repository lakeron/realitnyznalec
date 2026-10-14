# PostHog proxy pre realitnyznalec.sk

Spravovaná proxy bola vytvorená v PostHogu 14. 10. 2026. Služba je pre
PostHog Cloud bezplatná. Nastavenie je v [PostHog organizácii](https://eu.posthog.com/project/212693/settings/organization-proxy).

## DNS záznam vo Websupporte

V DNS zóne `realitnyznalec.sk` bol 14. 10. 2026 uložený tento záznam:

| Pole | Hodnota |
| --- | --- |
| Typ | `CNAME` |
| Názov / subdoména | `e` |
| Celý názov | `e.realitnyznalec.sk` |
| Cieľ | `236723bc2a5e4097ac00.cf-prod-eu-proxy.europehog.com.` |
| TTL | `600` |

Správny CNAME bol overený cez autoritatívne servery `ns1`, `ns2` a `ns3`
Websupportu aj verejné resolvery `1.1.1.1`, `8.8.8.8` a `9.9.9.9`. Proxy má
platný TLS certifikát. SDK `/static/array.js`, projektová konfigurácia
`/array/<project_token>/config.js` a endpoint `/flags/?v=2` odpovedajú HTTP 200.
Overenie na oboch IP adresách z verejného DNS prebehlo úspešne bez vypnutia
overovania certifikátu. Lokálny resolver môže dočasne držať starú negatívnu
DNS odpoveď.

## Zapnutie na webe

PostHog spravuje overenie domény, TLS certifikát a jeho obnovovanie.
Zmena stavu v organizácii má poradie **Waiting → Issuing → Live**.

Stav **Live** bol potvrdený 14. 10. 2026 v PostHogu. Produkčné nastavenie
v `analytics.js`:

```js
api_host: 'https://e.realitnyznalec.sk',
ui_host: 'https://eu.posthog.com',
```

Aj SDK súbor `/static/array.js` načítavať z rovnakého hostiteľa. Spravovaná
proxy obslúži SDK, konfiguráciu aj udalosti; GitHub Pages nepotrebuje server
ani zmenu hostingu. Pri riešení výpadku možno dočasne použiť priamy EU
endpoint `https://eu.i.posthog.com` pre SDK aj `api_host`.

Po nasadení overiť TLS a načítanie SDK, súhlas s analytikou, HTTP 200 pri
odoslaní udalosti a výskyt kontrolných udalostí v PostHogu. Pri odmietnutí
súhlasu nesmie web načítať SDK ani posielať analytické udalosti. V žiadostiach
sa nesmú odosielať meno, email alebo text rozpracovanej cenovej ponuky.
Endpoint `/e/` pri obyčajnom GET bez dát vracia HTTP 400 rovnako ako priamy
PostHog endpoint; to nie je chyba proxy. Zaznamenanie udalostí treba overiť
cez SDK a následne v PostHogu.

Spravovaná proxy smeruje prevádzku cez Cloudflare, subdodávateľa PostHogu.
Informácie o ochrane súkromia musia túto skutočnosť uviesť; prenos cez
Cloudflare nie je garantovaný výlučne v EÚ. Dáta sa následne prijímajú
v zvolenom EU regióne PostHogu.

Dokumentácia: [PostHog managed reverse proxy](https://posthog.com/docs/advanced/proxy).
