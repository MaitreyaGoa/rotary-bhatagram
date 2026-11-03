# Rotary Club of Bhatagram: website (rcbhatagram.com)

Static website for GitHub Pages. Firebase stores suggestions, join requests and content, and handles admin logins. Cloudinary stores photos.
Rotary International District 3170, Bicholim taluka, Goa.

```
index.html        public website, Classic design (the default)
dawn.html         the Dawn design (visitors switch with the Classic | Dawn button)
admin.html        admin panel (yourdomain/admin.html)
js/config.js      the ONLY file you edit to go live
js/data.js        data layer + starter club content
js/switch.js      the Classic | Dawn design switch (hide it: add layoutSwitch: false in config.js)
firestore.rules   security rules to paste into Firebase
assets/           put the official club logo here (logo.png)
CNAME             your domain (rcbhatagram.com), already filled in
.nojekyll         keep this (tells GitHub to serve files as-is)
```

Until `js/config.js` has Firebase keys, the site runs in **preview mode**: it shows the real club details, but anything you save stays only in your own browser. The preview admin password is `demo`.

---

## Part A: Put it online and test (about 10 minutes)

1. Unzip `rotary-bhatagram.zip` and open the `rotary-bhatagram` folder.
2. On github.com, click **+ → New repository**. Name it `rotary-bhatagram`, set it to **Public**, and tick **Add a README file**. Click **Create repository**.
3. Click **Add file → Upload files**. Select everything **inside** the folder (`index.html`, `admin.html`, `README.md`, `firestore.rules`, `CNAME`, and the `js` folder) and drag it in. Click **Commit changes**.
   - Check that `index.html` is at the top level of the repo and that `js/config.js` and `js/data.js` are inside a `js` folder.
4. Go to **Settings → Pages**. Under Source, choose **Deploy from a branch**, then branch `main`, folder `/ (root)`. Click **Save**.
5. After 1–2 minutes the site is live at `https://<your-username>.github.io/rotary-bhatagram/`.
6. Test it:
   - On your phone: the floating top bar and bottom bar, the 💡 button, the event countdown, the Four-Way Test cards (tap to flip), and both forms.
   - Open `…/rotary-bhatagram/admin.html` and sign in with any email and the password `demo`. Send a suggestion from the site and check that it appears under **Suggestions**. Upload 3 or more photos under **Gallery**: they'll float in the hero and the Gallery section will appear.

## Part B: Connect your domain

7. The `CNAME` file already contains `rcbhatagram.com`. Check that it's in the repo (if you uploaded an older `CNAME.example`, delete it).
8. At your domain registrar, open DNS settings:
   - Delete any existing `A` records for `@`.
   - Add 4 `A` records for host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Add a `CNAME` record: host `www` → `<your-username>.github.io`
9. In **Settings → Pages**, enter `rcbhatagram.com` under Custom domain and click **Save**. Once the DNS check passes, tick **Enforce HTTPS**. This takes anywhere from 15 minutes to a few hours.

## Part C: Go live (real forms, logins and uploads)

10. At console.firebase.google.com, click **Add project** and name it `rotary-bhatagram`. You can turn Analytics off.
11. Go to **Build → Firestore Database → Create database**. Choose location **asia-south1 (Mumbai)** and **production mode**.
12. Go to **Build → Authentication → Get started** and enable **Email/Password**.
    - **Users** tab → **Add user**: email `rcbhatagram@gmail.com` and a strong password.
    - **Settings → User actions** → untick **Enable create (sign-up)** and save, so nobody else can create an account.
    - **Settings → Authorized domains** → add `rcbhatagram.com`, `www.rcbhatagram.com` and `<your-username>.github.io`.
13. Go to **Firestore → Rules**, paste the whole contents of `firestore.rules` (the admin email `rcbhatagram@gmail.com` is already in it). Click **Publish**.
14. Go to **Project settings (⚙) → General → Your apps → Web `</>`** and register the app. Copy the six values from `firebaseConfig`.
15. At cloudinary.com, sign up for free and note your **Cloud name**. Then go to **Settings → Upload → Upload presets → Add**:
    - Signing mode: **Unsigned**
    - Folder: `rotary-bhatagram`
    - Save, and note the preset name.
16. On GitHub, open `js/config.js` and click ✏️. Paste the Firebase values and your Cloudinary `cloudName` and `uploadPreset`. Commit.
17. After a minute, open `/admin.html`, sign in with your real Firebase user, and go to **Settings → Load starter content**. This copies the club details, board and installation event into the database.
18. Refresh the website. The "Preview mode" badge should be gone. You're live.

## Troubleshooting

| What you see | Fix |
|---|---|
| 404 page | `index.html` isn't at the top level of the repo, or Pages is still building. Wait 2 minutes. |
| Admin shows "Could not load" | Your login email isn't in `firestore.rules` (step 13). |
| Can't sign in on your domain | Add the domain to Authorized domains (step 12). |
| Photo upload fails | The Cloudinary preset must be **Unsigned** and its name must match exactly. |
| Suggestions don't arrive | Check that the rules from step 13 were published. |

---

## Running the site day to day (admin panel)

- **Suggestions / Join requests:** mark each one read or done, call or WhatsApp the person, and export everything to CSV (opens in Excel or Sheets).
- **Events:** add each event with its date and time. Set "Date confirmed?" to "Not yet" to show a "To be confirmed" tag. The next event drives the countdown card at the top of the home page. Weekly meetings are added automatically from Settings.
- **Projects:** title, area of focus, date, impact (e.g. "200 saplings"), and a cover photo. The Projects section appears on the site once you add the first one.
- **Gallery:** upload many photos at once (they're resized automatically) and edit captions in place. With 3 or more photos, they float in the hero.
- **Team:** board members with role, display order and photo (square works best).
- **Settings:** founding-member count and charter stage, the four numbers under "Why Bhatagram?", the intro text, meeting day/time/venue, and contact links.

## Logo (Rotary brand rules)

Don't redraw the Rotary wheel. Create the official club logo at **brandcenter.rotary.org** (sign in with My Rotary) → Logos → club logo, and download the horizontal masterbrand PNG. Then add it to `index.html`: in the `<a class="brand">` at the top, replace `<b>Rotary</b><span>Club of Bhatagram</span>` with `<img src="assets/logo.png" alt="Rotary Club of Bhatagram">`, and upload the PNG to an `assets` folder.

**Brand colours:** Rotary Royal Blue `#17458F` and Rotary Gold `#F7A81B`. Rotary's secondary colours (Azure, Sky Blue, Cranberry, Violet, Orange, Turquoise, Grass) are used only to colour-code the seven causes.
