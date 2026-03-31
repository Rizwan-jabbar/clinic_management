import React, { useMemo, useState } from "react";

export default function PharmcyItems() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Dummy medicines data (no props, no API)
  const medicines = [
    {
      id: "med-001",
      name: "Paracetamol 500mg",
      category: "Pain & Fever",
      price: 50,
      stock: 120,
      expiry: "2027-01-15",
      manufacturer: "ABC Pharma",
      batchNo: "PCT-24-011",
    },
    {
      id: "med-002",
      name: "Amoxicillin 250mg",
      category: "Antibiotic",
      price: 180,
      stock: 35,
      expiry: "2026-09-01",
      manufacturer: "HealWell",
      batchNo: "AMX-25-090",
      prescriptionRequired: true,
    },
    {
      id: "med-003",
      name: "Cetirizine 10mg",
      category: "Allergy",
      price: 90,
      stock: 0,
      expiry: "2026-03-30",
      manufacturer: "CarePlus",
      batchNo: "CTZ-26-033",
    },
    {
      id: "med-004",
      name: "Omeprazole 20mg",
      category: "Gastric",
      price: 210,
      stock: 18,
      expiry: "2027-05-12",
      manufacturer: "GastroMed",
      batchNo: "OMP-27-051",
    },
    {
      id: "med-005",
      name: "ORS Sachet",
      category: "General",
      price: 30,
      stock: 250,
      expiry: "2028-02-10",
      manufacturer: "NutriLife",
      batchNo: "ORS-28-021",
    },
  ];

  const categories = useMemo(() => {
    const set = new Set(medicines.map((x) => x.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [medicines]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return medicines.filter((m) => {
      const matchesCategory = category === "All" || m.category === category;

      const haystack = [m.name, m.category, m.manufacturer, m.batchNo]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !q || haystack.includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [medicines, query, category]);

  const handleAdd = (medicine) => {
    if ((medicine.stock ?? 0) <= 0) return;
    // dummy add action
    alert(`Added: ${medicine.name}`);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Pharmacy Items</h2>
          <div style={styles.subtitle}>
            Showing {filtered.length} / {medicines.length} medicines
          </div>
        </div>

        <div style={styles.controls}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search (name, batch, manufacturer...)"
            style={styles.input}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.grid}>
        {filtered.map((m) => {
          const outOfStock = (m.stock ?? 0) <= 0;

          return (
            <div key={m.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div style={styles.badges}>
                  <span style={styles.badge}>{m.category}</span>
                  {m.prescriptionRequired ? (
                    <span style={{ ...styles.badge, ...styles.badgeWarn }}>
                      Rx
                    </span>
                  ) : null}
                  {outOfStock ? (
                    <span style={{ ...styles.badge, ...styles.badgeDanger }}>
                      Out of stock
                    </span>
                  ) : null}
                </div>

                <div style={styles.name}>{m.name}</div>

                <div style={styles.meta}>
                  <div>
                    <strong>Manufacturer:</strong> {m.manufacturer ?? "-"}
                  </div>
                  <div>
                    <strong>Batch:</strong> {m.batchNo ?? "-"}
                  </div>
                  <div>
                    <strong>Expiry:</strong> {m.expiry ?? "-"}
                  </div>
                </div>
              </div>

              <div style={styles.cardBottom}>
                <div style={styles.priceStock}>
                  <div style={styles.price}>Rs {m.price}</div>
                  <div style={styles.stock}>
                    Stock: <strong>{m.stock ?? 0}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleAdd(m)}
                  disabled={outOfStock}
                  style={{
                    ...styles.button,
                    ...(outOfStock ? styles.buttonDisabled : {}),
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          No medicines found. Search term ya category change kar ke dekhein.
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  wrapper: {
    padding: 16,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial',
  },
  headerRow: {
    display: "flex",
    gap: 12,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  title: { margin: 0, fontSize: 20, fontWeight: 700 },
  subtitle: { marginTop: 4, color: "#555", fontSize: 12 },
  controls: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 10,
    minWidth: 260,
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 10,
    outline: "none",
    minWidth: 160,
    background: "white",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 12,
  },
  card: {
    border: "1px solid #eee",
    borderRadius: 14,
    padding: 14,
    background: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 180,
  },
  cardTop: { display: "flex", flexDirection: "column", gap: 8 },
  badges: { display: "flex", gap: 6, flexWrap: "wrap" },
  badge: {
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    border: "1px solid #e6e6e6",
    background: "#fafafa",
  },
  badgeWarn: { borderColor: "#f2c94c", background: "#fff7db" },
  badgeDanger: { borderColor: "#eb5757", background: "#ffe3e3" },
  name: { fontSize: 16, fontWeight: 700, color: "#111" },
  meta: { fontSize: 12, color: "#444", lineHeight: 1.5 },
  cardBottom: {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  priceStock: { display: "flex", flexDirection: "column", gap: 2 },
  price: { fontSize: 16, fontWeight: 800 },
  stock: { fontSize: 12, color: "#444" },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #111",
    background: "#111",
    color: "white",
    cursor: "pointer",
    minWidth: 90,
    fontWeight: 700,
  },
  buttonDisabled: { opacity: 0.5, cursor: "not-allowed" },
  empty: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "#f7f7f7",
    border: "1px solid #eee",
    color: "#444",
  },
};