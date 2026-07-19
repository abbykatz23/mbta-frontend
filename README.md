# mbta-frontend

The website for the [MBTA pixel train display](https://github.com/abbykatz23/mbta-display)
project — design a 5×26 pixel train sprite, submit it with a name and birthday, and
it goes into the animation rotation on the physical display (with better odds
during your birthday week). Also includes a public gallery and a live browser
simulation of what's currently showing on the real display.

Part of three repos: [mbta-display](https://github.com/abbykatz23/mbta-display) (Pi
client) · [mbta-server](https://github.com/abbykatz23/mbta-server) (serverless API)
· **mbta-frontend** (this repo).

## Pages

One SPA, routed by query param:

- `/` — pixel-art designer: paint/fill tools, custom color palette, undo, sample
  trains to riff on, submit form.
- `/?gallery` — public gallery of every submitted and special train.
- `/?gallery&admin=true` — same gallery with edit/delete/"show now" controls,
  gated behind an API key entered once and kept in `sessionStorage`.
- `/?display` — a canvas-based live simulation of the physical Pixoo display,
  polling `mbta-server` for current state.

## Stack

React 18 + Vite, no UI framework. Both the pixel editor and the `?display`
simulator do their own canvas rendering — the simulator reimplements the Python
display's font and layout logic in JS so it matches the physical hardware
pixel-for-pixel.

## Running it

```bash
npm install
cp .env.example .env   # set VITE_SERVER_URL to your mbta-server API Gateway URL
                        # and VITE_TURNSTILE_SITE_KEY to your Turnstile site key
npm run dev
```

`npm run build` produces a static `dist/` deployable anywhere (e.g. Netlify).

## License

MIT — see [LICENSE](LICENSE).
