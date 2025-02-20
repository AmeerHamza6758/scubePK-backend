const TeamManagement = require("../models/teamManagement.model");

const teamManagementController = {
  createTeamMember: async (req, res) => {
    try {
      const { name, position, description } = req.body;
      let image = req.file ? req.file.filename : null;

      const teamMember = await TeamManagement.create({
        name,
        position,
        image,
        description,
      });

      res.status(201).json({
        status: true,
        data: teamMember,
        message: "Team member created successfully",
      });
    } catch (error) {
      console.error("Error while creating team member:", error);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  getAllTeamMembers: async (req, res) => {
    try {
      let { offset = 0, limit = 10, search = "" } = req.query;
      offset = parseInt(offset, 10);
      limit = parseInt(limit, 10);

      const filter = search ? { name: { [Op.like]: `%${search}%` } } : {};

      const { rows, count } = await TeamManagement.findAndCountAll({
        where: filter,
        offset,
        limit,
      });

      res.status(200).json({
        status: true,
        data: rows,
        totalCount: count,
        message: "Team members list fetched successfully",
      });
    } catch (error) {
      console.error("Error while fetching team members:", error.message);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },

  updateTeamMember: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const teamMember = await TeamManagement.findByPk(id);
      if (!teamMember) {
        return res.status(404).json({
          status: false,
          message: `No team member found with ID ${id}`,
        });
      }

      if (req.file) {
        updateData.image = req.file.filename;
      }

      await teamMember.update(updateData);

      res.status(200).json({
        status: true,
        data: teamMember,
        message: "Team Member data updated successfully",
      });
    } catch (error) {
      console.error("Error while updating team member:", error.message);
      res.status(500).json({ status: false, message: error.message });
    }
  },

  removeTeamMember: async (req, res) => {
    try {
      const { id } = req.params;
      const teamMember = await TeamManagement.findByPk(id);

      if (!teamMember) {
        return res.status(404).json({
          status: false,
          message: "Team member not found",
        });
      }

      await teamMember.destroy();

      res.status(200).json({
        status: true,
        message: "Team member deleted successfully",
      });
    } catch (error) {
      console.error("Error while deleting team member:", error.message);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  },
};

module.exports = teamManagementController;
