# Listo el Pollo — Ca Sa Pradina

Landing estática (HTML + JS ligero) para Coolify. Monopágina ES. CTA: llamar para reservar.

Dominio live: **https://casapradina.es** (`listoelpollo.es` no disponible).

## SEO / dominio

Canonical, OG, JSON-LD, `sitemap.xml`, `robots.txt` y `llms.txt` apuntan a `https://casapradina.es`.

Alinea la ficha de **Google Business Profile** (nombre Ca Sa Pradina, horario, fotos, teléfono).

Search Console: verificación DNS o archivo HTML. GSC **no** instala cookies en visitantes. Analytics (GA4) sí → entonces banner de consentimiento.

## Legal

`aviso-legal.html` · `privacidad.html` · `cookies.html` (titular María Inés Pavlovich, NIE X3088709Q, minespatina@gmail.com). Footer enlaza las tres. Sin banner: GSC sí, GA no. **Mapa Google embebido siempre**.

## Coolify

1. Repo [`Ivancf1995/ca_sa_pradina`](https://github.com/Ivancf1995/ca_sa_pradina), rama `main`.
2. Static Site o Dockerfile nginx.
3. Sin variables de app.

`stitch_listo_el_pollo_website/` = solo referencia de diseño (excluida del image vía `.dockerignore`).

## Local

```bash
python3 -m http.server 8080
```

Abre http://localhost:8080

## Contenido

- Teléfono reserva: `+34 871 931 319` (`tel:+34871931319`)
- Dirección: Carrer Gral. Ricardo Ortega, 9, 07006 Palma
- Horario: mar–dom 11:00–16:00
