import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  BadgeDollarSign,
  Building2,
  CalendarClock,
  ClipboardList,
  Download,
  FileBarChart2,
  Pill,
  ShoppingCart,
  Stethoscope,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getClinics } from "../../redux/clinicThunk/clinicThunk";
import { getDoctors } from "../../redux/doctorThunk/doctorThunk";
import { getPharmacies } from "../../redux/pharmacyThunk/pharmacyThunk";
import { getAllMedicines } from "../../redux/medicineThunk/medicineThunk";
import { getAllOrders } from "../../redux/orderThunk/orderThunk";
import { getAppointments } from "../../redux/appointmentThunk/appointmentThunk";
import { getAssistants } from "../../redux/assistantThunk/assistantThunk";

const adminLinks = [
  { to: "/clinics", label: "Manage Clinics", icon: Building2 },
  { to: "/doctors", label: "Manage Doctors", icon: Stethoscope },
  { to: "/pharmacyList", label: "Manage Pharmacies", icon: ClipboardList },
  { to: "/admin/orders", label: "Review Orders", icon: ShoppingCart },
  { to: "/allMedicine", label: "Medicine Overview", icon: Pill },
  { to: "/myAppointments", label: "Appointments", icon: CalendarClock },
];

const periodOptions = [
  { id: "day", label: "Daily" },
  { id: "week", label: "Weekly" },
  { id: "month", label: "Monthly" },
  { id: "year", label: "Yearly" },
];

const revenueViews = [
  { id: "combined", label: "Combined" },
  { id: "pharmacy", label: "Pharmacy" },
  { id: "doctor", label: "Doctor" },
];

const formatCurrency = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatPdfDate = (value) => new Date(value || Date.now()).toLocaleString();

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

const buildPdfDivider = (width) => "-".repeat(width);

const buildPdfTable = (columns, rows) => {
  const columnWidths = columns.map((column, index) => {
    const headerWidth = String(column.label).length;
    const rowWidth = Math.max(
      0,
      ...rows.map((row) => String(row[index] ?? "").length)
    );

    return Math.min(Math.max(headerWidth, rowWidth, column.minWidth || 10), column.maxWidth || 24);
  });

  const formatRow = (row) =>
    row
      .map((cell, index) => {
        const value = String(cell ?? "");
        const width = columnWidths[index];
        return value.length > width ? `${value.slice(0, Math.max(width - 1, 1))}.` : value.padEnd(width, " ");
      })
      .join(" | ");

  const headerRow = formatRow(columns.map((column) => column.label));
  const divider = columnWidths.map((width) => "-".repeat(width)).join("-+-");

  return [headerRow, divider, ...rows.map((row) => formatRow(row))];
};

const buildPdfHeader = (title, subtitle) => [
  "==============================================================",
  "CLINIC MANAGEMENT",
  title,
  subtitle,
  "==============================================================",
];

const escapePdfText = (text) =>
  String(text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");

  const createPdfBlob = (lines) => {
    const pageHeight = 842;
    const top = 800;
    const lineHeight = 16;
    const linesPerPage = 44;
  const pagedLines = [];

  for (let index = 0; index < lines.length; index += linesPerPage) {
    pagedLines.push(lines.slice(index, index + linesPerPage));
  }

  const objects = [];
  objects.push("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");

  const pageObjectIds = pagedLines.map((_, index) => 3 + index * 2);
  const contentObjectIds = pagedLines.map((_, index) => 4 + index * 2);

  objects.push(
    `2 0 obj << /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >> endobj`
  );

  pagedLines.forEach((pageLines, index) => {
    const pageId = pageObjectIds[index];
    const contentId = contentObjectIds[index];
    const textCommands = pageLines
      .map((line, lineIndex) => {
        const y = top - lineIndex * lineHeight;
        return `BT /F1 10 Tf 32 ${y} Td (${escapePdfText(line)}) Tj ET`;
      })
      .join("\n");

    const contentStream = `${textCommands}\n`;

    objects.push(
      `${pageId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 ${pageHeight}] /Resources << /Font << /F1 ${3 + pagedLines.length * 2} 0 R >> >> /Contents ${contentId} 0 R >> endobj`
    );
    objects.push(
      `${contentId} 0 obj << /Length ${contentStream.length} >> stream\n${contentStream}endstream\nendobj`
    );
  });

  const fontObjectId = 3 + pagedLines.length * 2;
  objects.push(`${fontObjectId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
};

const downloadPdf = (fileName, lines) => {
  const blob = createPdfBlob(lines);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function AdminDashboard() {
  const dispatch = useDispatch();
  const { clinics, loading: clinicsLoading } = useSelector((state) => state.clinics);
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctors);
  const { pharmacies, loading: pharmacyLoading } = useSelector((state) => state.pharmacy);
  const { medicines, loading: medicineLoading } = useSelector((state) => state.medicine);
  const { orders, ordersLoading } = useSelector((state) => state.order);
  const { appointments, loading: appointmentsLoading } = useSelector((state) => state.appointments);
  const { assistants, loading: assistantsLoading } = useSelector((state) => state.assistants);

  const [activePeriod, setActivePeriod] = useState("month");
  const [revenueView, setRevenueView] = useState("combined");
  const [selectedPharmacyId, setSelectedPharmacyId] = useState("all");
  const [selectedDoctorId, setSelectedDoctorId] = useState("all");

  useEffect(() => {
    dispatch(getClinics());
    dispatch(getDoctors());
    dispatch(getPharmacies());
    dispatch(getAllMedicines());
    dispatch(getAllOrders());
    dispatch(getAppointments());
    dispatch(getAssistants());
  }, [dispatch]);

  const pharmacyMap = useMemo(() => new Map(pharmacies.map((item) => [item._id?.toString(), item])), [pharmacies]);
  const doctorMap = useMemo(() => new Map(doctors.map((item) => [item._id?.toString(), item])), [doctors]);
  const periodStart = useMemo(() => getPeriodStart(activePeriod), [activePeriod]);

  const filteredOrders = useMemo(() => orders.filter((order) => new Date(order?.createdAt || order?.orderDate) >= periodStart), [orders, periodStart]);
  const filteredAppointments = useMemo(() => appointments.filter((appointment) => new Date(appointment?.appointmentDate || appointment?.createdAt) >= periodStart), [appointments, periodStart]);

  const pharmacyRevenueRows = useMemo(() => {
    const revenueMap = new Map();

    filteredOrders.forEach((order) => {
      if (order?.orderStatus !== "Delivered") return;

      (order?.items || []).forEach((item) => {
        const pharmacyId = item?.medicineId?.addedBy?.toString();
        const pharmacyName = item?.medicineId?.pharmacyName || pharmacyMap.get(pharmacyId)?.pharmacyName || "Pharmacy";
        if (!pharmacyId) return;
        if (selectedPharmacyId !== "all" && selectedPharmacyId !== pharmacyId) return;

        const quantity = Number(item?.quantity || 0);
        const selling = Number(item?.price || 0) * quantity;
        const purchase = Number(item?.medicineId?.purchasePrice || 0) * quantity;
        const grossProfit = selling - purchase;
        const adminIncome = grossProfit > 0 ? grossProfit * 0.05 : 0;
        const current = revenueMap.get(pharmacyId) || { id: pharmacyId, name: pharmacyName, orders: new Set(), totalSelling: 0, grossProfit: 0, adminIncome: 0, itemsSold: 0 };

        current.orders.add(order?._id);
        current.totalSelling += selling;
        current.grossProfit += grossProfit;
        current.adminIncome += adminIncome;
        current.itemsSold += quantity;
        revenueMap.set(pharmacyId, current);
      });
    });

    return [...revenueMap.values()].map((item) => ({ ...item, orderCount: item.orders.size })).sort((a, b) => b.adminIncome - a.adminIncome);
  }, [filteredOrders, pharmacyMap, selectedPharmacyId]);

  const doctorRevenueRows = useMemo(() => {
    const revenueMap = new Map();

    filteredAppointments.forEach((appointment) => {
      const doctorId = appointment?.doctor?._id?.toString();
      if (!doctorId) return;
      if (selectedDoctorId !== "all" && selectedDoctorId !== doctorId) return;

      const doctor = doctorMap.get(doctorId) || appointment?.doctor;
      const fee = Number(doctor?.doctorFee || 0);
      const current = revenueMap.get(doctorId) || { id: doctorId, name: doctor?.name || "Doctor", totalAppointments: 0, completedAppointments: 0, pendingAppointments: 0, cancelledAppointments: 0, grossRevenue: 0, adminIncome: 0 };

      current.totalAppointments += 1;
      if (appointment?.status === "Completed") {
        current.completedAppointments += 1;
        current.grossRevenue += fee;
        current.adminIncome += fee * 0.03;
      }
      if (appointment?.status === "Pending") current.pendingAppointments += 1;
      if (appointment?.status === "Cancelled") current.cancelledAppointments += 1;
      revenueMap.set(doctorId, current);
    });

    return [...revenueMap.values()].sort((a, b) => b.adminIncome - a.adminIncome);
  }, [filteredAppointments, doctorMap, selectedDoctorId]);
  const pharmacyTotals = useMemo(() => pharmacyRevenueRows.reduce((acc, item) => {
    acc.totalSelling += item.totalSelling;
    acc.grossProfit += item.grossProfit;
    acc.adminIncome += item.adminIncome;
    acc.itemsSold += item.itemsSold;
    acc.orderCount += item.orderCount;
    return acc;
  }, { totalSelling: 0, grossProfit: 0, adminIncome: 0, itemsSold: 0, orderCount: 0 }), [pharmacyRevenueRows]);

  const doctorTotals = useMemo(() => doctorRevenueRows.reduce((acc, item) => {
    acc.grossRevenue += item.grossRevenue;
    acc.adminIncome += item.adminIncome;
    acc.totalAppointments += item.totalAppointments;
    acc.completedAppointments += item.completedAppointments;
    return acc;
  }, { grossRevenue: 0, adminIncome: 0, totalAppointments: 0, completedAppointments: 0 }), [doctorRevenueRows]);

  const combinedAdminIncome = pharmacyTotals.adminIncome + doctorTotals.adminIncome;
  const combinedOperationalRevenue = pharmacyTotals.totalSelling + doctorTotals.grossRevenue;
  const assistantDoctorShare = doctorTotals.grossRevenue * 0.02;
  const selectedWindowDeliveredOrders = filteredOrders.filter((item) => item?.orderStatus === "Delivered").length;
  const selectedWindowCompletedAppointments = filteredAppointments.filter((item) => item?.status === "Completed").length;
  const assistantLinkedAppointments = appointments.filter((item) => item?.assistant?._id).length;

  const dashboardSummary = {
    clinics: clinics.length,
    doctors: doctors.length,
    pharmacies: pharmacies.length,
    medicines: medicines.length,
    assistants: assistants.length,
    orders: orders.length,
    appointments: appointments.length,
    completedAppointments: appointments.filter((item) => item?.status === "Completed").length,
    pendingAppointments: appointments.filter((item) => item?.status === "Pending").length,
    cancelledAppointments: appointments.filter((item) => item?.status === "Cancelled").length,
    activePharmacies: pharmacies.filter((item) => item?.status === "active").length,
    outOfStockMedicines: medicines.filter((item) => Number(item?.stock || 0) === 0).length,
  };

  const topRows = revenueView === "doctor" ? doctorRevenueRows : pharmacyRevenueRows;

  const downloadDashboardPdf = () => {
    const summaryTable = buildPdfTable(
      [
        { label: "Metric", minWidth: 24, maxWidth: 28 },
        { label: "Value", minWidth: 18, maxWidth: 22 },
      ],
      [
        ["Combined Admin Income", formatCurrency(combinedAdminIncome)],
        ["Pharmacy Admin Income", formatCurrency(pharmacyTotals.adminIncome)],
        ["Doctor Admin Income", formatCurrency(doctorTotals.adminIncome)],
        ["Assistant Doctor Share", formatCurrency(assistantDoctorShare)],
        ["Platform Revenue", formatCurrency(combinedOperationalRevenue)],
        ["Delivered Orders In Window", selectedWindowDeliveredOrders],
        ["Completed Appointments", selectedWindowCompletedAppointments],
      ]
    );

    const platformTable = buildPdfTable(
      [
        { label: "Record", minWidth: 24, maxWidth: 28 },
        { label: "Count", minWidth: 10, maxWidth: 12 },
      ],
      [
        ["Clinics", dashboardSummary.clinics],
        ["Doctors", dashboardSummary.doctors],
        ["Pharmacies", dashboardSummary.pharmacies],
        ["Assistants", dashboardSummary.assistants],
        ["Medicines", dashboardSummary.medicines],
        ["Orders", dashboardSummary.orders],
        ["Appointments", dashboardSummary.appointments],
        ["Assistant Linked Appointments", assistantLinkedAppointments],
        ["Completed Appointments", dashboardSummary.completedAppointments],
        ["Pending Appointments", dashboardSummary.pendingAppointments],
        ["Cancelled Appointments", dashboardSummary.cancelledAppointments],
      ]
    );

    downloadPdf("admin-dashboard-summary.pdf", [
      ...buildPdfHeader("ADMIN ANALYTICS REPORT", "Revenue, operations and workforce summary"),
      `Generated At : ${formatPdfDate()}`,
      `Period       : ${periodOptions.find((item) => item.id === activePeriod)?.label}`,
      `Revenue View : ${revenueViews.find((item) => item.id === revenueView)?.label}`,
      `Pharmacy     : ${selectedPharmacyId === "all" ? "All Pharmacies" : pharmacyMap.get(selectedPharmacyId)?.pharmacyName || "Selected Pharmacy"}`,
      `Doctor       : ${selectedDoctorId === "all" ? "All Doctors" : doctorMap.get(selectedDoctorId)?.name || "Selected Doctor"}`,
      buildPdfDivider(62),
      "FINANCIAL SUMMARY",
      ...summaryTable,
      "",
      "PLATFORM RECORDS",
      ...platformTable,
    ]);
  };

  const downloadPharmacyPdf = () => {
    const reportTable = buildPdfTable(
      [
        { label: "Pharmacy", minWidth: 18, maxWidth: 18 },
        { label: "Orders", minWidth: 7, maxWidth: 8 },
        { label: "Items", minWidth: 7, maxWidth: 8 },
        { label: "Selling", minWidth: 12, maxWidth: 14 },
        { label: "Profit", minWidth: 12, maxWidth: 14 },
        { label: "Admin 5%", minWidth: 12, maxWidth: 14 },
      ],
      pharmacyRevenueRows.map((row) => [
        row.name,
        row.orderCount,
        row.itemsSold,
        formatCurrency(row.totalSelling),
        formatCurrency(row.grossProfit),
        formatCurrency(row.adminIncome),
      ])
    );

    downloadPdf("admin-pharmacy-revenue.pdf", [
      ...buildPdfHeader("PHARMACY REVENUE REPORT", "Delivered-order financial breakdown"),
      `Generated At : ${formatPdfDate()}`,
      `Period       : ${periodOptions.find((item) => item.id === activePeriod)?.label}`,
      `Selection    : ${selectedPharmacyId === "all" ? "All Pharmacies" : pharmacyMap.get(selectedPharmacyId)?.pharmacyName || "Selected Pharmacy"}`,
      buildPdfDivider(62),
      `Delivered Selling : ${formatCurrency(pharmacyTotals.totalSelling)}`,
      `Gross Profit      : ${formatCurrency(pharmacyTotals.grossProfit)}`,
      `Admin Share 5%    : ${formatCurrency(pharmacyTotals.adminIncome)}`,
      `Item Volume       : ${pharmacyTotals.itemsSold}`,
      "",
      "PHARMACY TABLE",
      ...(pharmacyRevenueRows.length > 0 ? reportTable : ["No pharmacy revenue records found for the selected filters."]),
    ]);
  };

  const downloadDoctorPdf = () => {
    const reportTable = buildPdfTable(
      [
        { label: "Doctor", minWidth: 16, maxWidth: 18 },
        { label: "Appointments", minWidth: 11, maxWidth: 12 },
        { label: "Completed", minWidth: 9, maxWidth: 10 },
        { label: "Revenue", minWidth: 11, maxWidth: 13 },
        { label: "Admin 3%", minWidth: 10, maxWidth: 11 },
        { label: "Assist 2%", minWidth: 10, maxWidth: 11 },
      ],
      doctorRevenueRows.map((row) => [
        row.name,
        row.totalAppointments,
        row.completedAppointments,
        formatCurrency(row.grossRevenue),
        formatCurrency(row.adminIncome),
        formatCurrency(row.grossRevenue * 0.02),
      ])
    );

    downloadPdf("admin-doctor-revenue.pdf", [
      ...buildPdfHeader("DOCTOR REVENUE REPORT", "Completed-appointment earnings and platform share"),
      `Generated At : ${formatPdfDate()}`,
      `Period       : ${periodOptions.find((item) => item.id === activePeriod)?.label}`,
      `Selection    : ${selectedDoctorId === "all" ? "All Doctors" : doctorMap.get(selectedDoctorId)?.name || "Selected Doctor"}`,
      buildPdfDivider(62),
      `Doctor Revenue    : ${formatCurrency(doctorTotals.grossRevenue)}`,
      `Admin Share 3%    : ${formatCurrency(doctorTotals.adminIncome)}`,
      `Assistant Share 2%: ${formatCurrency(assistantDoctorShare)}`,
      `Completed Visits  : ${doctorTotals.completedAppointments}`,
      "",
      "DOCTOR TABLE",
      ...(doctorRevenueRows.length > 0 ? reportTable : ["No doctor revenue records found for the selected filters."]),
    ]);
  };

  if (clinicsLoading || doctorsLoading || pharmacyLoading || medicineLoading || ordersLoading || appointmentsLoading || assistantsLoading) {
    return <div className="py-20 text-center text-lg text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-4 font-clinic-body">
      <section className="rounded-[26px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/35 backdrop-blur-xl sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              <FileBarChart2 size={14} />
              Admin Dashboard
            </span>
            <div>
              <h1 className="font-clinic-heading text-[24px] font-semibold text-slate-900 sm:text-[28px]">Revenue, Records & Platform Control</h1>
              <p className="mt-1 max-w-3xl text-[12px] leading-5 text-slate-500">Review pharmacy income, doctor income, combined admin earnings, and platform-wide operational data from one complete control panel.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {periodOptions.map((period) => (
              <button key={period.id} type="button" onClick={() => setActivePeriod(period.id)} className={`rounded-xl px-3 py-2 text-[11px] font-semibold transition ${activePeriod === period.id ? "bg-gradient-to-r from-sky-600 to-teal-500 text-white shadow-lg shadow-sky-500/20" : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700"}`}>
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Combined Admin Income</p><p className="mt-2 text-[21px] font-semibold text-emerald-700">{formatCurrency(combinedAdminIncome)}</p></div><span className="rounded-2xl bg-emerald-50 p-2"><Wallet size={16} className="text-emerald-700" /></span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">Pharmacy and doctor admin shares combined.</p></div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Pharmacy Income</p><p className="mt-2 text-[21px] font-semibold text-sky-700">{formatCurrency(pharmacyTotals.adminIncome)}</p></div><span className="rounded-2xl bg-sky-50 p-2"><BadgeDollarSign size={16} className="text-sky-700" /></span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">5% admin share from delivered pharmacy profit.</p></div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Doctor Income</p><p className="mt-2 text-[21px] font-semibold text-teal-700">{formatCurrency(doctorTotals.adminIncome)}</p></div><span className="rounded-2xl bg-teal-50 p-2"><Stethoscope size={16} className="text-teal-700" /></span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">3% admin share from completed doctor appointments.</p></div>
            <div className="rounded-[22px] border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Platform Revenue</p><p className="mt-2 text-[21px] font-semibold text-slate-900">{formatCurrency(combinedOperationalRevenue)}</p></div><span className="rounded-2xl bg-slate-100 p-2"><TrendingUp size={16} className="text-slate-900" /></span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">Selling volume and doctor fees combined for selected period.</p></div>
          </div>

          <div className="rounded-[22px] bg-gradient-to-r from-sky-600 to-teal-500 p-4 text-white shadow-lg shadow-sky-500/20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">Export Center</p>
            <div className="mt-3 space-y-2">
              <button type="button" onClick={downloadDashboardPdf} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-white/20"><Download size={14} />Download Summary PDF</button>
              <button type="button" onClick={downloadPharmacyPdf} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-white/20"><Download size={14} />Download Pharmacy PDF</button>
              <button type="button" onClick={downloadDoctorPdf} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-white/20"><Download size={14} />Download Doctor PDF</button>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-white/85">Export current summary or filtered revenue records as PDF files.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Clinics</p><p className="mt-2 text-[22px] font-semibold text-slate-900">{dashboardSummary.clinics}</p><p className="mt-2 text-[11px] text-slate-500">Total clinic records in platform.</p></div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Doctors / Assistants</p><p className="mt-2 text-[22px] font-semibold text-slate-900">{dashboardSummary.doctors} / {dashboardSummary.assistants}</p><p className="mt-2 text-[11px] text-slate-500">Total doctor and assistant workforce.</p></div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Pharmacies</p><p className="mt-2 text-[22px] font-semibold text-slate-900">{dashboardSummary.pharmacies}</p><p className="mt-2 text-[11px] text-slate-500">{dashboardSummary.activePharmacies} active pharmacies right now.</p></div>
        <div className="rounded-[22px] border border-white/70 bg-white/90 px-4 py-4 shadow-sm"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">Medicines</p><p className="mt-2 text-[22px] font-semibold text-slate-900">{dashboardSummary.medicines}</p><p className="mt-2 text-[11px] text-slate-500">{dashboardSummary.outOfStockMedicines} are out of stock.</p></div>
      </section>

      <section className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Revenue Filters</h2>
            <p className="mt-1 text-[12px] text-slate-500">Switch between combined, pharmacy-only, and doctor-only revenue views. You can also inspect a specific pharmacy or doctor.</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <select value={revenueView} onChange={(e) => setRevenueView(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700">
              {revenueViews.map((item) => (<option key={item.id} value={item.id}>{item.label}</option>))}
            </select>
            <select value={selectedPharmacyId} onChange={(e) => setSelectedPharmacyId(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700" disabled={revenueView === "doctor"}>
              <option value="all">All Pharmacies</option>
              {pharmacies.map((item) => (<option key={item._id} value={item._id}>{item.pharmacyName}</option>))}
            </select>
            <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-700" disabled={revenueView === "pharmacy"}>
              <option value="all">All Doctors</option>
              {doctors.map((item) => (<option key={item._id} value={item._id}>{item.name}</option>))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{revenueView === "doctor" ? "Doctor Revenue Records" : "Pharmacy Revenue Records"}</h2>
                <p className="mt-1 text-[12px] text-slate-500">{revenueView === "doctor" ? "Doctor performance and admin income from completed appointments." : "Pharmacy delivered-order revenue, gross profit, and admin income records."}</p>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700">{topRows.length} records</span>
            </div>

            <div className="mt-4 space-y-2">
              {topRows.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-[12px] text-slate-500">No records found for the selected filters.</div>
              ) : (
                topRows.slice(0, 6).map((row) => (
                  <div key={row.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-slate-900">{row.name}</p>
                        <p className="mt-1 text-[10px] text-slate-500">{revenueView === "doctor" ? `${row.totalAppointments} appointments / ${row.completedAppointments} completed` : `${row.orderCount} orders / ${row.itemsSold} items sold`}</p>
                      </div>
                      <p className="text-[12px] font-semibold text-emerald-700">{formatCurrency(row.adminIncome)}</p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                      <span className="rounded-full bg-white px-2.5 py-1">{revenueView === "doctor" ? `Revenue ${formatCurrency(row.grossRevenue)}` : `Selling ${formatCurrency(row.totalSelling)}`}</span>
                      <span className="rounded-full bg-white px-2.5 py-1">Admin {formatCurrency(row.adminIncome)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} className="rounded-[22px] border border-white/70 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="inline-flex rounded-2xl bg-sky-50 p-3 text-sky-700"><Icon size={18} /></div>
                  <h2 className="mt-3 text-base font-semibold text-slate-900">{item.label}</h2>
                  <p className="mt-1 text-[11px] leading-5 text-slate-500">Open this section to review records and keep daily operations under control.</p>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="text-lg font-semibold text-slate-900">Platform Snapshot</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Orders</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{dashboardSummary.orders}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Appointments</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{dashboardSummary.appointments}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Completed Appointments</p><p className="mt-1 text-[18px] font-semibold text-emerald-700">{dashboardSummary.completedAppointments}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Pending Appointments</p><p className="mt-1 text-[18px] font-semibold text-amber-600">{dashboardSummary.pendingAppointments}</p></div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="text-lg font-semibold text-slate-900">Revenue Breakdown</h2>
            <div className="mt-4 space-y-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Delivered Pharmacy Selling</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{formatCurrency(pharmacyTotals.totalSelling)}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Doctor Revenue</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{formatCurrency(doctorTotals.grossRevenue)}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Pharmacy Admin Share</p><p className="mt-1 text-[18px] font-semibold text-sky-700">{formatCurrency(pharmacyTotals.adminIncome)}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Doctor Admin Share</p><p className="mt-1 text-[18px] font-semibold text-teal-700">{formatCurrency(doctorTotals.adminIncome)}</p></div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/30">
            <h2 className="text-lg font-semibold text-slate-900">Inventory View</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">In Stock</p><p className="mt-1 text-[18px] font-semibold text-emerald-700">{medicines.filter((item) => Number(item?.stock || 0) > 0).length}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Out Of Stock</p><p className="mt-1 text-[18px] font-semibold text-rose-700">{dashboardSummary.outOfStockMedicines}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Pharmacy Records</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{pharmacyRevenueRows.length}</p></div>
              <div className="rounded-2xl bg-slate-50 px-3 py-3"><p className="text-[10px] uppercase tracking-[0.16em] text-slate-400">Doctor Records</p><p className="mt-1 text-[18px] font-semibold text-slate-900">{doctorRevenueRows.length}</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
