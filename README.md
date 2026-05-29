# Tenryu Circle 🔴

Next.js 14 + Clerk Auth. Tanpa database eksternal.

---

## Setup Railway Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/member
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/pendaftaran
CLERK_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=https://tenryu-production.up.railway.app
ADMIN_SECRET=password_rahasia_kamu
```

---

## Cara Set Admin Pertama Kali

1. Register & login di website
2. Buka browser, akses URL ini (ganti nilainya):

```
https://tenryu-production.up.railway.app/api/admin/setrole
```

Kirim PUT request dengan body:
```json
{
  "secret": "password_rahasia_kamu",
  "clerkId": "user_xxx"
}
```

Atau pakai cara mudah — buka **browser console** di website setelah login, jalankan:

```javascript
fetch('/api/admin/setrole', {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    secret: 'password_rahasia_kamu',
    clerkId: 'CLERK_ID_KAMU'
  })
}).then(r => r.json()).then(console.log)
```

Clerk ID bisa dilihat di Clerk Dashboard → Users → klik user → copy ID.

3. Refresh halaman → sekarang bisa akses `/admin`

---

## Flow User

1. Register Clerk → otomatis ke `/pendaftaran`
2. Isi form → tunggu di `/menunggu`
3. Admin approve → role jadi MEMBER
4. Bisa akses `/member` dashboard

