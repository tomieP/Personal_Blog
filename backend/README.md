#
## Backend structure

```
backend
│
├── prisma
│
├── src
│   ├── config/
│   ├── controllers/             # Nhận request trả response
│   ├── services/                # Chứa business logic
│   ├── repositories/            # Làm việc với Prisma
│   ├── middlewares/             
│   ├── routes/                  
│   ├── utils/                   # Hàm dùng chung
│   ├── validators/              # Zod schema
│   ├── uploads/                 # Ảnh, emoji, thumnail
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── prisma
```