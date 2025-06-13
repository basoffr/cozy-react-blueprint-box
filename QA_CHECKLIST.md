# Port Standardization QA Checklist

This checklist helps verify that the development environment is correctly configured with standardized ports:
- Front-end (Vite): http://127.0.0.1:5173
- Back-end (Flask): http://127.0.0.1:5000

## Front-end Verification

- [ ] Run `npm run dev` and verify it logs `Local: http://127.0.0.1:5173/`
- [ ] Confirm the browser opens to http://127.0.0.1:5173
- [ ] Check that API requests in the Network tab are going to `/api/*` endpoints
- [ ] Verify no CORS errors appear in the console

## Back-end Verification

- [ ] Run `cd flask_app && python app.py` and verify it logs `Running on http://127.0.0.1:5000`
- [ ] Open http://127.0.0.1:5000 in a browser and confirm you see the "API is running" message
- [ ] Test the debug endpoint at http://127.0.0.1:5000/debug/request
- [ ] Verify the templates endpoint works at http://127.0.0.1:5000/templates/

## Proxy Verification

- [ ] With both servers running, visit http://127.0.0.1:5173 in the browser
- [ ] Open developer tools and go to the Network tab
- [ ] Perform actions that trigger API calls
- [ ] Verify requests to `/api/*` are proxied to the Flask backend
- [ ] Confirm the `X-API-Key` header is included in development requests
- [ ] Check that no redirects occur (no 301/302 status codes)
- [ ] Ensure no CORS errors appear in the console

## Production Build Verification

- [ ] Run `npm run build && npx serve -s dist`
- [ ] Open the Network tab in developer tools
- [ ] Verify API requests go directly to `https://api.mydomain.com` (not to the local proxy)

## Configuration Files Verification

- [ ] Confirm package.json has dev and preview scripts with `--port 5173`
- [ ] Verify vite.config.ts has proxy target set to `http://127.0.0.1:5000`
- [ ] Check flask_app/app.py has port set to 5000
- [ ] Ensure src/api/api.ts uses `/api` in dev and `https://api.mydomain.com` in prod
