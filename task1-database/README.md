# Task 1 – Critical MongoDB Indexes

I've come up with **three critical indexes** required for the Notification Service database.

The indexing strategy is designed around:

- High-frequency user reads
- Fast unread badge queries
- Efficient worker delivery processing
- Embedded delivery status inside `deliveries[]`
- Avoiding collection scans at scale

---

# 1. User + CreatedAt (Descending)

## Purpose
Fetch paginated notifications for a specific user ordered by newest first.

### Query Used by Mobile App

```ts
Notification.find({ userId })
  .sort({ createdAt: -1 })
  .limit(10);
```

Without this index MongoDB must:
- Filter by user
- Then perform in-memory sort

---

## ✅ Index Definition

```ts
notificationSchema.index(
  { userId: 1, createdAt: -1 },
  { name: 'idx_user_createdAt_desc' }
);
```

---

## Why Critical

- Infinite scrolling feed
- Stable pagination
- Eliminates in-memory sorting
- Scales to millions of notifications per user

---

# 2. User + IsRead + CreatedAt

## Purpose
Unread notification filtering and badge counts.

### Queries

```ts
Notification.find({
  userId,
  isRead: false,
}).sort({ createdAt: -1 });

Notification.countDocuments({
  userId,
  isRead: false,
});
```

Without this index MongoDB scans all user notifications.

---

## ✅ Index Definition

```ts
notificationSchema.index(
  { userId: 1, isRead: 1, createdAt: -1 },
  { name: 'idx_user_isRead_createdAt' }
);
```

---

## Why Critical

- Fast unread badge count
- Fast unread filter
- Prevents collection scan
- Maintains low API latency

---

# 3. Deliveries.Channel + Deliveries.Status + CreatedAt  
(Multikey Worker Processing Index)

## Purpose
Allow workers to efficiently fetch pending deliveries from the embedded delivery array.

Each notification contains:

```ts
deliveries: [
  {
    channel: 'push' | 'email' | 'inapp',
    status: 'pending' | 'sent' | 'failed',
    attempts: number,
    updatedAt?: Date
  }
]
```

Workers poll for pending jobs:

```ts
Notification.find({
  deliveries: {
    $elemMatch: {
      channel: 'push',
      status: 'pending'
    }
  }
})
.sort({ createdAt: 1 })
.limit(100);
```

Without an index:
MongoDB scans the entire collection and inspects every array element.

---

## ✅ Index Definition (Multikey)

```ts
notificationSchema.index(
  {
    'deliveries.channel': 1,
    'deliveries.status': 1,
    createdAt: 1
  },
  { name: 'idx_deliveryChannel_status_createdAt' }
);
```

---

## Why This Is Critical

- Enables fast worker polling
- Prevents full collection scan
- Supports ordered batch processing
- Handles very large queues efficiently
- Required because delivery state is embedded

---

# Summary Table

| Index | Fields | Used By | Purpose |
|------|------|------|------|
| `idx_user_createdAt_desc` | `{ userId, createdAt }` | Mobile feed | Pagination |
| `idx_user_isRead_createdAt` | `{ userId, isRead, createdAt }` | Badge & unread | Filtering |
| `idx_deliveryChannel_status_createdAt` | `{ deliveries.channel, deliveries.status, createdAt }` | Workers | Delivery processing |

---

# Design Principles Applied

- Query-shape based indexing
- Equality fields first
- Sort fields last
- Multikey index for embedded arrays
- Avoid redundant indexes
- Optimized for read-heavy workloads

---

# Final Outcome

These indexes guarantee:

- Fast notification feed
- Instant unread badge count
- Efficient background delivery processing
- Horizontal scalability
- No collection scans even at scale
