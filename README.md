# Listo el Pollo — Ca Sa Padrina

Landing estática (HTML + JS ligero) para Coolify. Monopágina ES. CTA: llamar para reservar.

## SEO / dominio

Antes de indexar en serio, sustituye `https://listoelpollo.es` en:

- `index.html` (`site-origin`, canonical, OG, JSON-LD)
- `sitemap.xml`
- `robots.txt` (línea Sitemap)
- `llms.txt`

Y alinea la ficha de **Google Business Profile** (nombre, horario, fotos, teléfono).

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
