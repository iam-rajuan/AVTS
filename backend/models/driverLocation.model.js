const mongoose = require('mongoose');

const driverLocationSchema = new mongoose.Schema({
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'captain',
    required: true,
    unique: true,
    index: true,
  },
  vehicleId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  captainName: {
    type: String,
    required: true,
    trim: true,
  },
  vehicle: {
    plate: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      required: true,
      trim: true,
    },
  },
  currentLoad: {
    type: String,
    enum: [ 'no_load', 'empty_capacity', 'half_load', 'full_load', 'custom' ],
    default: 'no_load',
  },
  customLoadLabel: {
    type: String,
    trim: true,
    default: '',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: [ 'Point' ],
      default: 'Point',
    },
    coordinates: {
      type: [ Number ],
      default: [ 0, 0 ],
    },
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

driverLocationSchema.index({ location: '2dsphere' });

const DriverLocation = mongoose.model('DriverLocation', driverLocationSchema);

module.exports = DriverLocation;
