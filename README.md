# 🧩 short.ly - packaged with the **r2c-url-shortener**

A lightweight, pluggable Node.js utility for shortening URLs using **PostgreSQL**, **Redis**, and **SHA-256 hashing**. Perfect for building your own short URL service or integrating into existing backend microservices.

---

## 🚀 Features

- 🔗 Generates unique short URLs with collision handling
- 🧠 Uses Redis for fast lookup caching
- 🗄 Persists URLs in PostgreSQL
- ⚙️ Configurable via user-defined options
- ❌ Handles edge cases with custom error handling

*Note: Free API version, custom domain hosting, CDN caching and much more to come soon*

---

## 📦 Installation

```bash
npm install r2c-url-shortener
```

---

## 🧰 Usage

### 1. Initialize PostgreSQL and Redis connections:

```js
const { initPostgres, initRedis } = require('r2c-url-shortener');

initPostgres({
  username: 'postgres',
  password: 'your_password',
  host: 'localhost',
  database: 'url-shortener',
  port: 5432,
});

initRedis({
  url: 'redis://localhost:6379',
});
```

---

### 2. Compress a Long URL

```js
const { compress } = require('r2c-url-shortener');

const func = async() => {
  const urlObject = {
    longUrl: "https://www.youtube.com/watch?v=h4i7aRqIeRA&ab_channel=FarawayVillage"
  };
  const options = {
    baseUrl: "your_url", // Your URL e.g. http://abc.com
    maxCollisionAttempts: 50,  // optional
    urlCachingInMinutes: 45    // optional
  };
  const response = await compress(urlObject, options);
  console.log("Compressed URL: ", response.shortUrl);
  // Example output URL: https://abc.com/5f75f76
};
```

---

### 3. Redirect the short URL generated using above compress()

```js
const { redirect } = require('r2c-url-shortener');

const func = async() => {
  await redirect({ shortUrl: "https://{your_domain}/5f75f76" });
};
```

---

## 🗃️ Dependencies

- `pg` for PostgreSQL connection
- `redis` for in-memory key-value caching
- `uuid` and `moment` for ID & timestamp management
- Node’s native `crypto` (WebCrypto API) for hashing

---

## 📁 Database Schema

You must have a `urls` table in PostgreSQL:

```sql
CREATE TABLE urls (
  id UUID PRIMARY KEY,
  short_code TEXT NOT NULL UNIQUE,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```

---

## 🛡 Error Handling

All errors are wrapped in a custom `AppError` class with `statusCode` and `message`. You can handle them in your main app like this:

```js
try {
  await compress(...);
} catch (err) {
  console.error(err.statusCode, err.message);
}
```

---

## 📜 License

MIT © Almonds Technology Corporation
📧 almonds.corporation@gmail.com

### Comments, suggestions and bug reports are welcomed 
