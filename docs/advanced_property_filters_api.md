# 🏠 Advanced Property Filter API

**Endpoint**
```
POST /api/property/advanced-filter.php
```

This API returns a list of **approved properties** based on optional filters. You may send **only the filters you need**; sending an empty JSON object returns all approved properties.

---

## 🔐 Request Basics

### Method
```
POST
```

### Headers
```http
Content-Type: application/json
```

### Body
- Must be valid JSON
- All fields are optional

---

## 📥 Request Filters (Simple & Safe)

### 💰 Price Filter (Most Common)
```json
{
  "price_min": 1000,
  "price_max": 10000
}
```

| Field | Type | Default |
|-----|-----|-----|
| price_min | number | 0 |
| price_max | number | 999999 |

---

### 🛏️ Capacity Filters
```json
{
  "guests_min": 2,
  "bedrooms_min": 1,
  "bathrooms_min": 1
}
```

| Field | Type | Default |
|-----|-----|-----|
| guests_min | integer | 0 |
| bedrooms_min | integer | 0 |
| bathrooms_min | integer | 0 |

---

### 📍 Location & Distance (Optional)
```json
{
  "search_lat": 15.2993,
  "search_lon": 74.124,
  "distance": 200
}
```

| Field | Type | Default |
|-----|-----|-----|
| search_lat | float | null |
| search_lon | float | null |
| distance | integer (KM) | 100 |

> Distance filtering applies **only** if latitude and longitude are provided.

---

### 🏷️ Property Type
```json
{
  "property_types": ["House", "Villa"]
}
```

| Field | Type |
|-----|-----|
| property_types | array<string> |

---

### 🧰 Amenities (OR logic)
```json
{
  "amenities": [2, 5]
}
```

| Field | Type | Description |
|-----|-----|-----|
| amenities | array<int> | Matches if **any** amenity exists |

---

### ⭐ Rating Filter
```json
{
  "rating_min": 4
}
```

| Field | Type | Default |
|-----|-----|-----|
| rating_min | float | 0 |

> Properties with no reviews default to rating **5**.

---

### 📆 Availability Filter (Strict)
```json
{
  "filter_availability": true,
  "check_in_date": "2026-02-10",
  "check_out_date": "2026-02-15"
}
```

| Field | Type | Required |
|-----|-----|-----|
| filter_availability | boolean | Yes |
| check_in_date | YYYY-MM-DD | If enabled |
| check_out_date | YYYY-MM-DD | If enabled |

> Properties with booking conflicts are **excluded**.

---

## ✅ Recommended Minimal Requests

### 1️⃣ Get all approved properties
```json
{}
```

---

### 2️⃣ Price-only filter (Safe)
```json
{
  "price_min": 1000,
  "price_max": 10000
}
```

---

### 3️⃣ Location + price (Balanced)
```json
{
  "search_lat": 15.2993,
  "search_lon": 74.124,
  "distance": 200,
  "price_max": 10000
}
```

---

## 📤 Response Format

### Success
```json
{
  "success": true,
  "data": [
    {
      "id": 1054,
      "title": "Trail Access On-Site: Gorgeous MCM Deck House!",
      "description": "Cathedral Ceiling w/ Wood Beams | Baby Grand Piano | Game Room...",
      "house_rules": "sdsdv",
      "property_type": "House",
      "status": "approved",
      "created_at": "2026-01-18 04:28:13",
      "updated_at": "2026-01-18 04:52:24",

      "host_id": 132,
      "host_name": "Evolve Vacation Rental",
      "host_email": "host@example.com",
      "host_phone": "9638527410",

      "bedrooms": 4,
      "bathrooms": 2,
      "guests_max": 8,

      "location_city": "Dover",
      "location_address": "141 Pine Street, Dover, MA, USA",
      "location_description": "Wooded property next to Snow Hill Reservation",
      "location_latitude": "42.21993960",
      "location_longitude": "-71.28470800",

      "check_in_time": "14:00:00",
      "check_out_time": "11:00:00",

      "base_price": "1093.00",
      "currency": "USD",
      "weekly_discount": "0.00",
      "monthly_discount": "0.00",
      "cancellation_policy": "strict",

      "distance": null,
      "rating": 5,
      "review_count": 0,

      "images": [
        {
          "id": 23508,
          "image_url": "uploads/properties/property_1054_1.jpg",
          "file_name": "property_1054_1.jpg",
          "alt_text": "",
          "is_primary": 0,
          "image_order": 1
        }
      ],

      "amenities": [
        {
          "amenity_id": 1,
          "name": "Wi-Fi",
          "icon": "fas fa-wifi"
        },
        {
          "amenity_id": 5,
          "name": "Parking",
          "icon": "fas fa-parking"
        }
      ],

      "landmarks": [],
      "reviews": []
    }
  ],
  "count": 1,
  "filters_applied": {
    "distance": 100,
    "price_range": [1000, 10000],
    "bedrooms": 0,
    "guests": 0,
    "bathrooms": 0,
    "amenities_count": 0,
    "property_types": [],
    "rating_min": 0,
    "cancellation_policy": null
  }
}
```

---

### Error
```json
{
  "success": false,
  "message": "Invalid request method"
}
```

---

## 🧠 Important Notes
- Empty request `{}` returns all approved properties
- Amenities use **OR** logic
- Availability filter is the **most restrictive**
- Results are sorted by distance when location is used
- Maximum **4 images** per property

---

**File:** `advanced-filter.md`

