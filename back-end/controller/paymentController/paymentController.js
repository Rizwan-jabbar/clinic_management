import Doctor from "../../model/doctorModel/doctorModel.js";

const updatePaymet = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const payment = Number(req.body.payment);

        if (!Number.isFinite(payment) || payment <= 0) {
            return res.status(400).json({ message: "Valid payment amount is required" });
        }

        const checkDoctor = await Doctor.findById(doctorId);

        if (!checkDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const currentAmountToPay = Number(checkDoctor.amountToPay || 0);

        checkDoctor.paymentsHistory.push({
            amount: payment,
            method: "online",
            date: new Date(),
        });

        if (payment > currentAmountToPay) {
            checkDoctor.amountToPay = 0;
            checkDoctor.paymentStatus = "paid";
            await checkDoctor.save();

            return res.status(200).json({
                message: "Payment status updated to paid",
                amountToPay: checkDoctor.amountToPay,
                paymentStatus: checkDoctor.paymentStatus,
            });
        }

        if (payment < currentAmountToPay) {
            checkDoctor.amountToPay = currentAmountToPay - payment;
            checkDoctor.paymentStatus = "partial";
            await checkDoctor.save();

            return res.status(200).json({
                message: `Partial payment received. Remaining monthly amount: ${checkDoctor.amountToPay}`,
                amountToPay: checkDoctor.amountToPay,
                paymentStatus: checkDoctor.paymentStatus,
            });
        }

        checkDoctor.amountToPay = 0;
        checkDoctor.paymentStatus = "paid";
        await checkDoctor.save();

        return res.status(200).json({
            message: "Payment status updated to paid",
            amountToPay: checkDoctor.amountToPay,
            paymentStatus: checkDoctor.paymentStatus,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

const paymentController = {
    updatePaymet
};

export default paymentController;
