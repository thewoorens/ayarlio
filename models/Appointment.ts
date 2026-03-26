import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  tenantId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  code: string;
  startTime: Date;
  endTime: Date;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  cancellationReason?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required"],
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Staff is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Appointment code is required"],
      unique: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  },
);

AppointmentSchema.index({ tenantId: 1, staffId: 1, startTime: 1, endTime: 1 });
AppointmentSchema.index({ tenantId: 1, customerId: 1, startTime: -1 });
AppointmentSchema.index({ tenantId: 1, status: 1, startTime: 1 });
AppointmentSchema.index({ tenantId: 1, code: 1 });

AppointmentSchema.pre("save", function () {
  if (this.isModified("endTime") || this.isNew) {
    if (this.endTime) {
      const expireDate = new Date(this.endTime);
      expireDate.setDate(expireDate.getDate() + 14);
      this.expiresAt = expireDate;
    }
  }
});

AppointmentSchema.pre("findOneAndUpdate", function () {
  const update: any = this.getUpdate();

  if (update && (update.endTime || (update.$set && update.$set.endTime))) {
    const endTimeVal = update.endTime || update.$set.endTime;

    if (endTimeVal) {
      const expireDate = new Date(endTimeVal);
      expireDate.setDate(expireDate.getDate() + 14);

      if (!update.$set) update.$set = {};
      update.$set.expiresAt = expireDate;
    }
  }
});
const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
