// DefaultLogger
// +console logging
// +file logging

// System Statistics
// +server started
// +per request performance
// +storage size

class Demonstration {
    // Receive logger instance in constructor.
    // Receive database driver for resetting records.
    // Receive settings for thresholds.
    // (?) Store demonstration settings in a demo-config.js file.

    // Set interval to check for logs and reset database.
    // +time before next reset
    // +time since last reset

    // Reset logs when done.
}

class DemonstrationLogger {
    // Register a log watcher.
    // Set a maximum limit on number of logs received
    // (!) Limit should not be below demonstration thresholds.

    // Log a request and its type.
    // Log a "write" request size.

    // Count "write" requests.
    // Count total requests.
}

// Datastore +delete all records.
// (?) Keep unmodified records. Diff!
// Datastore +import backup.
// (?) Use demo (and test) fixtures in code instead of backup.
// Add cool quotes, demo-related and software-related notes when resetting.

// `force-demo-data-reset/` endpoint.

// Create a 429 Limit reached response before quotas are reached on server.

module.exports = Demonstration;
