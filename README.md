# Async Race 🚗💨

**Deployed UI:** [https://suroNorekyan.github.io/asyncRace](https://suroNorekyan.github.io/asyncRace)  
**Estimated Score:** 400/400 ✅

---

## 📋 Checklist (Self-Assessment)

- [x] **UI Deployment** (GitHub Pages)
- [x] **Commit Guidelines** (conventional commits followed)
- [x] **Checklist in README.md**
- [x] **Score calculation included**

### Basic Structure (80 pts)

- [x] Two views (Garage & Winners) (10)
- [x] Garage view with creation, editing, race control, garage section (30)
- [x] Winners view with table & pagination (10)
- [x] Persistent state between views (30)

### Garage View (90 pts)

- [x] CRUD operations for cars (20)
- [x] Color picker + rendering (10)
- [x] 100 random cars (20)
- [x] Car management buttons (10)
- [x] Pagination (7 per page) (10)
- [x] Empty garage handling + auto back to previous page (20, extra)

### Winners View (50 pts)

- [x] Display winners (15)
- [x] Pagination (10)
- [x] Table with №, car, name, wins, best time (15)
- [x] Sorting by wins & best time (10)

### Race (170 pts)

- [x] Start engine animation + handle 500 error (20)
- [x] Stop engine animation (20)
- [x] Responsive animation (≥500px) (30)
- [x] Start race button (10)
- [x] Reset race button (15)
- [x] Winner banner (5)
- [x] Proper button states (20)
- [x] Predictable actions during race (block/remove/etc) (50)

### Prettier & ESLint (10 pts)

- [x] Prettier setup (5)
- [x] Airbnb ESLint strict config (5)

### Code Quality (100 pts, Skipped during the self-check)

---

## 🚀 How to Run Locally

Clone the repo:

```bash
git clone https://github.com/SuroNorekyan/asyncRace.git
cd asyncRace
```

Install dependencies::

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:
``bash
npm run build

````

Deploy to Github Pages:
```bash
npm run deploy
````
