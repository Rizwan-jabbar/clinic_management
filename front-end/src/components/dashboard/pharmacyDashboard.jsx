import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BadgeDollarSign,
  Boxes,
  CircleOff,
  Clock3,
  Package2,
  Pill,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getMedicines } from "../../redux/medicineThunk/medicineThunk";
import { getPharmacyOrders } from "../../redux/orderThunk/orderThunk";

const periodOptions = [
  { id: "day", label: "Daily" },
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
];

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;

const getPeriodStart = (period) => {
  const now = new Date();
  const start = new Date(now);

  if (period === "day") {
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === "week") {
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  if (period === "month") {
    start.setMonth(now.getMonth() - 1);
    return start;
  }

  start.setFullYear(now.getFullYear() - 1);
  return start;
};

function PharmacyDashboard() {
  const dispatch = useDispatch();
  const { medicines, loading: medicinesLoading } = useSelector((state) => state.medicine);
  const { orders, ordersLoading } = useSelector((state) => state.order);
  const [activePeriod, setActivePeriod] = useState("day");

  useEffect(() => {
    dispatch(getMedicines());
    dispatch(getPharmacyOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const periodStart = getPeriodStart(activePeriod);

    return orders.filter((order) => {
      const orderDate = new Date(order?.createdAt || order?.orderDate);
      return orderDate >= periodStart;
    });
  }, [orders, activePeriod]);

  const overallStatusMetrics = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        acc[order?.orderStatus] = (acc[order?.orderStatus] || 0) + 1;
        return acc;
      },
      {
        totalOrders: 0,
        Pending: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
      }
    );
  }, [orders]);

  const metrics = useMemo(() => {
    return filteredOrders.reduce(
      (acc, order) => {
        acc.totalOrders += 1;
        acc[order?.orderStatus] = (acc[order?.orderStatus] || 0) + 1;

        (order?.items || []).forEach((item) => {
          const quantity = Number(item?.quantity || 0);
          const lineSelling = Number(item?.price || 0) * quantity;
          const purchasePrice = Number(item?.medicineId?.purchasePrice || 0);
          const linePurchase = purchasePrice * quantity;

          acc.totalUnits += quantity;

          if (order?.orderStatus === "Delivered") {
            acc.totalSelling += lineSelling;
            acc.grossProfit += lineSelling - linePurchase;
            acc.deliveredUnits += quantity;
          }
        });

        return acc;
      },
      {
        totalSelling: 0,
        totalOrders: 0,
        totalUnits: 0,
        grossProfit: 0,
        Pending: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
        deliveredUnits: 0,
      }
    );
  }, [filteredOrders]);

  const inventoryMetrics = useMemo(() => {
    return medicines.reduce(
      (acc, medicine) => {
        const stock = Number(medicine?.stock || 0);
        acc.totalMedicines += 1;
        acc.totalStock += stock;
        if (stock > 0) acc.inStock += 1;
        if (stock === 0) acc.outOfStock += 1;
        if (stock > 0 && stock <= 10) acc.lowStock += 1;
        return acc;
      },
      {
        totalMedicines: 0,
        totalStock: 0,
        inStock: 0,
        outOfStock: 0,
        lowStock: 0,
      }
    );
  }, [medicines]);

  const superAdminShare = metrics.grossProfit > 0 ? metrics.grossProfit * 0.05 : 0;
  const netProfit = metrics.grossProfit - superAdminShare;
  const averageOrderValue = metrics.Delivered > 0 ? metrics.totalSelling / metrics.Delivered : 0;
  const stockCoverage =
    inventoryMetrics.totalMedicines > 0
      ? (inventoryMetrics.inStock / inventoryMetrics.totalMedicines) * 100
      : 0;

  const recentMedicines = useMemo(
    () =>
      [...medicines]
        .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
        .slice(0, 5),
    [medicines]
  );

  const recentOrders = useMemo(
    () =>
      [...filteredOrders]
        .sort((a, b) => new Date(b?.createdAt || b?.orderDate || 0) - new Date(a?.createdAt || a?.orderDate || 0))
        .slice(0, 5),
    [filteredOrders]
  );

  const primaryCards = [
    {
      label: "Total Selling",
      value: formatCurrency(metrics.totalSelling),
      note: `${metrics.Delivered} delivered orders in selected window`,
      icon: Wallet,
      tone: "text-emerald-700",
      bg: "bg-emerald-50",
    },
    {
      label: "Net Profit",
      value: formatCurrency(netProfit),
      note: `After 5% super admin share of ${formatCurrency(superAdminShare)}`,
      icon: BadgeDollarSign,
      tone: "text-sky-700",
      bg: "bg-sky-50",
    },
    {
      label: "Delivered Orders",
      value: overallStatusMetrics.Delivered,
      note: `${overallStatusMetrics.Cancelled} cancelled overall`,
      icon: ShieldCheck,
      tone: "text-teal-700",
      bg: "bg-teal-50",
    },
    {
      label: "Inventory Health",
      value: `${inventoryMetrics.inStock}/${inventoryMetrics.totalMedicines}`,
      note: `${stockCoverage.toFixed(0)}% medicines currently in stock`,
      icon: Pill,
      tone: "text-slate-900",
      bg: "bg-slate-100",
    },
  ];

  const statCards = [
    {
      label: "Orders",
      value: metrics.totalOrders,
      helper: `${metrics.Pending} pending, ${metrics.Processing} processing`,
      icon: ShoppingCart,
      tone: "text-slate-800",
    },
    {
      label: "Units Sold",
      value: metrics.deliveredUnits,
      helper: `Delivered-only revenue / Avg ${formatCurrency(averageOrderValue)}`,
      icon: Boxes,
      tone: "text-slate-800",
    },
    {
      label: "In Stock",
      value: inventoryMetrics.inStock,
      helper: `${inventoryMetrics.lowStock} low stock medicines`,
      icon: Package2,
      tone: "text-emerald-700",
    },
    {
      label: "Out Of Stock",
      value: inventoryMetrics.outOfStock,
      helper: `${inventoryMetrics.totalStock} total units available`,
      icon: CircleOff,
      tone: "text-rose-700",
    },
  ];

  if (medicinesLoading || ordersLoading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4 font-clinic-body">
      <section className="rounded-[26px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/35 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              <TrendingUp size={14} />
              Pharmacy Dashboard
            </span>
            <div>
              <h1 className="font-clinic-heading text-[24px] font-semibold text-slate-900 sm:text-[28px]">
                Sales, Orders & Stock
              </h1>
              <p className="mt-1 max-w-2xl text-[12px] leading-5 text-slate-500">
                Compact overview of pharmacy performance, delivered orders, cancelled orders, and current inventory health.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {periodOptions.map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setActivePeriod(period.id)}
                className={`rounded-xl px-3 py-2 text-[11px] font-semibold transition ${
                  activePeriod === period.id
                    ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/20"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {primaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {card.label}
                      </p>
                      <p className={`mt-2 text-[21px] font-semibold ${card.tone}`}>{card.value}</p>
                    </div>
                    <span className={`rounded-2xl p-2 ${card.bg}`}>
                      <Icon size={16} className={card.tone} />
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">{card.note}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[22px] bg-gradient-to-r from-sky-600 to-teal-500 p-4 text-white shadow-lg shadow-sky-500/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Revenue Window</p>
            <p className="mt-2 text-[26px] font-semibold">{formatCurrency(metrics.totalSelling)}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-2xl bg-white/10 px-3 py-2">
                <p className="text-white/70">Gross Profit</p>
                <p className="mt-1 font-semibold">{formatCurrency(metrics.grossProfit)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-2">
                <p className="text-white/70">Avg Order</p>
                <p className="mt-1 font-semibold">{formatCurrency(averageOrderValue)}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-white/85">
              Current filter: {periodOptions.find((item) => item.id === activePeriod)?.label}.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                    {card.label}
                  </p>
                  <p className={`mt-2 text-[22px] font-semibold ${card.tone}`}>{card.value}</p>
                </div>
                <Icon size={18} className={card.tone} />
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">{card.helper}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Delivered</p>
              <p className="mt-2 text-[22px] font-semibold text-emerald-700">{overallStatusMetrics.Delivered}</p>
              <p className="mt-2 text-[11px] text-slate-500">Successfully completed orders overall.</p>
            </div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Pending</p>
              <p className="mt-2 text-[22px] font-semibold text-amber-600">{overallStatusMetrics.Pending}</p>
              <p className="mt-2 text-[11px] text-slate-500">Orders waiting for processing.</p>
            </div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Processing</p>
              <p className="mt-2 text-[22px] font-semibold text-sky-700">{overallStatusMetrics.Processing}</p>
              <p className="mt-2 text-[11px] text-slate-500">Orders currently being prepared.</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Inventory Snapshot</h2>
              <p className="mt-1 text-[12px] text-slate-500">
                Important medicine details with stock and pricing visibility.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {recentMedicines.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-[12px] text-slate-500">
                  No medicine data available yet.
                </div>
              ) : (
                recentMedicines.map((medicine) => {
                  const stock = Number(medicine?.stock || 0);

                  return (
                    <div
                      key={medicine._id}
                      className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_86px_86px_90px]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold text-slate-900">{medicine.name}</p>
                        <p className="mt-1 truncate text-[11px] text-slate-500">
                          {medicine.category || "General"} - {medicine.brand || "Generic"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Buy</p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-700">
                          {formatCurrency(medicine.purchasePrice)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Sell</p>
                        <p className="mt-1 text-[11px] font-semibold text-emerald-700">
                          {formatCurrency(medicine.sellingPrice ?? medicine.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Stock</p>
                        <p className={`mt-1 text-[11px] font-semibold ${stock > 0 ? "text-slate-900" : "text-rose-600"}`}>
                          {stock > 0 ? `${stock} units` : "Out"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
                <p className="mt-1 text-[12px] text-slate-500">
                  Important order details for the selected period.
                </p>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                {filteredOrders.length} orders
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {recentOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-[12px] text-slate-500">
                  No orders found for this time range.
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-900">
                          {order?.customerInfo?.fullName || "Customer"}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {new Date(order?.createdAt || order?.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-[12px] font-semibold text-emerald-700">
                        {formatCurrency(order?.totalAmount)}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                      <span className="rounded-full bg-white px-2.5 py-1">{order?.orderStatus}</span>
                      <span className="rounded-full bg-white px-2.5 py-1">
                        {(order?.items || []).length} items
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Clock3 size={16} className="text-sky-700" />
              Quick Status View
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Pending</p>
                <p className="mt-1 text-[18px] font-semibold text-amber-600">{overallStatusMetrics.Pending}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Processing</p>
                <p className="mt-1 text-[18px] font-semibold text-sky-700">{overallStatusMetrics.Processing}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">All Medicines</p>
                <p className="mt-1 text-[18px] font-semibold text-slate-900">
                  {inventoryMetrics.totalMedicines}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Total Stock</p>
                <p className="mt-1 text-[18px] font-semibold text-slate-900">
                  {inventoryMetrics.totalStock}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PharmacyDashboard;
