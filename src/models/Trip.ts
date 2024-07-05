import { Schema, model, Document } from "mongoose";

interface ILocation {
  lat: number;
  lng: number;
}

interface ITrip extends Document {
  driverId: Schema.Types.ObjectId;
  passengerId: Schema.Types.ObjectId;
  status: "started" | "inTransit" | "canceled" | "completed";
  driverLocation: ILocation;
  passengerLocation: ILocation;
  driverDestination: ILocation;
  passengerDestination: ILocation;
  distanceApart: number;
  timeElapsed: number;
}

const tripSchema = new Schema<ITrip>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    passengerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["started", "inTransit", "canceled", "completed"],
      required: true,
    },
    driverLocation: { type: { lat: Number, lng: Number }, required: true },
    passengerLocation: { type: { lat: Number, lng: Number }, required: true },
    driverDestination: { type: { lat: Number, lng: Number }, required: true },
    passengerDestination: {
      type: { lat: Number, lng: Number },
      required: true,
    },
    distanceApart: { type: Number, required: true },
    timeElapsed: { type: Number, required: true },
  },
  { timestamps: true }
);

const Trip = model<ITrip>("Trip", tripSchema);

export default Trip;
