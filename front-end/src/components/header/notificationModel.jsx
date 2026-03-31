import { X, User, Stethoscope, Building2, Clock } from "lucide-react";

const NotificationModal = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className="fixed inset-0 z-[999] flex min-h-screen items-center justify-center bg-black/40 backdrop-blur-sm p-4">

      <div className="w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all duration-300">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Appointment Notification
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">

          {/* Message */}
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
            {notification?.message}
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-3 text-sm">
            <Stethoscope size={18} className="text-blue-600" />
            <span className="text-slate-700">
              Doctor: <strong>{notification?.doctorId?.name}</strong>
            </span>
          </div>

          {/* Clinic */}
          <div className="flex items-center gap-3 text-sm">
            <Building2 size={18} className="text-indigo-600" />
            <span className="text-slate-700">
              Clinic: <strong>{notification?.clinicId?._id}</strong>
            </span>
          </div>

          {/* Assistant */}
          <div className="flex items-center gap-3 text-sm">
            <User size={18} className="text-green-600" />
            <span className="text-slate-700">
              Assistant: <strong>{notification?.assistantId?.name}</strong>
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 text-sm">
            <Clock size={18} className="text-slate-500" />
            <span className="text-slate-500">
              {new Date(notification?.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Professional Note */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <strong>Note:</strong>  
            Your appointment request has been successfully approved.  
            Please arrive at the clinic at least <strong>10 minutes earlier</strong> 
            to avoid any delay in consultation.
          </div>

        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotificationModal;