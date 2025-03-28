const Event = require("../models/event.model");

// Create event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message || "Error creating event" });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.update(req.params.id, req.body);
    res.status(200).json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    const code = error.message?.includes("not found") ? 404 : 500;
    res.status(code).json({ error: error.message || "Error updating event" });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: error.message || "Error retrieving events" });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const result = await Event.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting event:", error);
    const code = error.message?.includes("not found") ? 404 : 500;
    res.status(code).json({ error: error.message || "Error deleting event" });
  }
};
