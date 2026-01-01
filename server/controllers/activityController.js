import Activity from "../models/Activity.js";
import User from "../models/User.js";

// Create a new activity
export const createActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    // Create new activity and auto-add creator to participants list
    const activity = new Activity({
      ...req.body,
      createdBy: userId,
      participants: [userId] // creator automatically becomes a participant
    });

    await activity.save();

    // Update the user record
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        createdActivities: activity._id,
        joinedActivities: activity._id
      }
    });

    res.status(201).json({
      message: "Activity created successfully",
      activity
    });

  } catch (error) {
    console.error("Create Activity Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get all activities
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("createdBy", "name email")
      .populate("participants", "name email");
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};

// Get activity by ID
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("participants", "name email");

    if (!activity) return res.status(404).json({ message: "Activity not found" });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// export const getNearbyActivities = async (req, res) => {
//   try {
//     const { lat, lng, radius = 5 } = req.query; // radius in km

//     if (!lat || !lng) {
//       return res.status(400).json({ message: "Latitude and longitude required" });
//     }

//     const activities = await Activity.find({
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [parseFloat(lng), parseFloat(lat)]
//           },
//           $maxDistance: radius * 1000 // convert km to meters
//         }
//       }
//     });

//     res.json(activities);
//   } catch (error) {
//     console.error("Nearby Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getNearbyActivities = async (req, res) => {
  //  console.log("Nearby API hit", req.query)
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in km

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const activities = await Activity.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6371 // radius in radians (Earth radius in km)
          ]
        }
      }
    });

    res.json(activities);
  } catch (error) {
    console.error("Nearby Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getActivityParticipants = async (req, res) => {
  try {
    const activityId = req.params.id;

    const activity = await Activity.findById(activityId).populate(
      "participants",
      "-password"
    );

    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    res.json({
      participants: activity.participants
    });
  } catch (error) {
    console.error("Participants Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Join an activity
export const joinActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    // Check if user already joined
    if (activity.participants.includes(userId)) {
      return res.status(400).json({ message: "You have already joined this activity" });
    }

    // Add user to activity participants
    activity.participants.push(userId);
    await activity.save();

    // Add activity to user's joined list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedActivities: activityId }
    });

    return res.json({ message: "Joined successfully", activity });
  } catch (error) {
    console.error("JOIN ACTIVITY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) return res.status(404).json({ message: "Not found" });

    // Only creator can update
    if (activity.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    activity.title = req.body.title;
    activity.description = req.body.description;
    activity.type = req.body.type;
    activity.date = req.body.date;
    activity.location = req.body.location;
    await activity.save();

    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const startActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    // Only creator can start
    if (activity.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can start this activity" });
    }

    activity.status = "ongoing";
    activity.startedAt = new Date();

    await activity.save();

    res.json({ message: "Activity started", activity });

  } catch (error) {
    console.error("Start Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const endActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const userId = req.user._id;

    const activity = await Activity.findById(activityId);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    // Only creator can end
    if (activity.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can end this activity" });
    }

    activity.status = "completed";
    activity.endedAt = new Date();

    await activity.save();

    res.json({ message: "Activity ended", activity });

  } catch (error) {
    console.error("End Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const leaveActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const activityId = req.params.id;

    const activity = await Activity.findById(activityId);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    // Check if user is not a participant
    if (!activity.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are not part of this activity" });
    }

    // Prevent removing the creator from their own activity
    if (activity.createdBy.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Creators cannot leave their own activity"
      });
    }

    // Remove from participants
    activity.participants = activity.participants.filter(
      (id) => id.toString() !== userId.toString()
    );
    await activity.save();

    // Remove from user's joined activities
    await User.findByIdAndUpdate(userId, {
      $pull: { joinedActivities: activityId }
    });

    res.json({
      message: "Left activity successfully",
      activity
    });
  } catch (error) {
    console.error("Leave Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Delete an activity
export const deleteActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const activityId = req.params.id;

    const activity = await Activity.findById(activityId);
    if (!activity)
      return res.status(404).json({ message: "Activity not found" });

    // Only creator can delete
    if (activity.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the creator can delete this activity"
      });
    }

    // Remove activity from all participants' joinedActivities
    await User.updateMany(
      { joinedActivities: activityId },
      { $pull: { joinedActivities: activityId } }
    );

    // Remove from creator's createdActivities
    await User.findByIdAndUpdate(userId, {
      $pull: { createdActivities: activityId }
    });

    // Delete activity
    await Activity.findByIdAndDelete(activityId);

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete Activity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const searchActivities = async (req, res) => {
  try {
    const { q = "", lat, lng, radius } = req.query;

    // text matching on title, description, type (case-insensitive)
    const textQuery = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
            { type: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    // If location provided, add $near filter
    let locationQuery = {};
    if (lat && lng) {
      const maxDistance = radius ? parseFloat(radius) * 1000 : 10000; // default 10km
      locationQuery = {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
            $maxDistance: maxDistance,
          },
        },
      };
    }

    // Combine queries
    const finalQuery = Object.keys(locationQuery).length
      ? { $and: [textQuery, locationQuery] }
      : textQuery;

    const activities = await Activity.find(finalQuery)
      .populate("createdBy", "name email")
      .limit(100) // safety cap
      .exec();

    res.json(activities);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Autocomplete endpoint: returns top N suggestions for titles/types
// GET /api/activities/autocomplete?q=term
export const autocompleteActivities = async (req, res) => {
  try {
    const { q = "", limit = 6 } = req.query;
    if (!q) return res.json([]);

    // Search by title or type prefix
    const regex = new RegExp("^" + q, "i"); // starts with q
    const results = await Activity.find({
      $or: [{ title: { $regex: regex } }, { type: { $regex: regex } }],
    })
      .select("title type location")
      .limit(parseInt(limit))
      .lean();

    // map to small objects
    const payload = results.map((r) => ({
      _id: r._id,
      title: r.title,
      type: r.type,
      coords: r.location?.coordinates || null,
    }));

    res.json(payload);
  } catch (error) {
    console.error("Autocomplete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};