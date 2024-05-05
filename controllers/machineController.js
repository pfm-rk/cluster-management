// Import necessary modules
const { Machine, MachineState, sequelize } = require('../models/models');
const { Op } = require('sequelize')

// Controller functions

// GET /clusters/:clusterId/machines - Get all machines in a cluster
exports.getAllMachinesInCluster = async (req, res) => {
    try {
        // Fetch all machines in the specified cluster from the database
        const machines = await Machine.findAll({
            where: { clusterId: req.params.clusterId },
            include: MachineState // Include MachineState model to get current state
        });

        // Calculate total count of machines
        const totalCount = machines.length;

        // Calculate count of active machines (where MachineState is not "stopped")
        const activeCount = machines.filter(machine => machine.MachineState && machine.MachineState.state !== 'stopped').length;

        // Prepare response with total count, active count, and machines
        const response = {
            totalCount: totalCount,
            activeCount: activeCount,
            machines: machines
        };

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching machines in the cluster.', error: error });
    }
};

// POST /clusters/:clusterId/machines - Create a new machine in a cluster
exports.createMachineInCluster = async (req, res) => {
    try {
        // Extract machine details from request body
        const { name, ipAddress, instanceType, tags } = req.body;
        const { clusterId } = req.params;

        // Create the machine in the specified cluster
        const machine = await Machine.create({
            name: name,
            ipAddress: ipAddress,
            instanceType: instanceType,
            tags: JSON.stringify(tags || []), // Ensure tags is an array
            clusterId: clusterId
        });

        // Create the machine state with initial state "started"
        await MachineState.create({
            state: 'started',
            machineId: machine.id
        });

        res.status(201).json(machine);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating machine in the cluster.', error: error });
    }
};


// DELETE /clusters/:clusterId/machines/:machineId - Delete a machine by ID in a cluster
exports.deleteMachineInCluster = async (req, res) => {
    try {
        const { clusterId, machineId } = req.params;

        // Find the machine in the specified cluster
        const machine = await Machine.findOne({ where: { id: machineId, clusterId: clusterId } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found in the cluster.' });
        }

        // Delete the machine
        await machine.destroy();
        res.status(200).json({ message: 'Machine deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting machine in the cluster.', error: error });
    }
};

// POST /clusters/:clusterId/machines/:machineId/start - Start a machine by ID in a cluster
exports.startMachineInCluster = async (req, res) => {
    try {
        const { clusterId, machineId } = req.params;

        // Find the machine in the specified cluster
        const machine = await Machine.findOne({ where: { id: machineId, clusterId: clusterId } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found in the cluster.' });
        }

        // Check if machine state is already 'started'
        const machineState = await MachineState.findOne({ where: { machineId: machineId } });
        if (machineState && machineState.state === 'started') {
            return res.status(400).json({ message: 'Machine is already started.' });
        }

        // Update machine state to 'started'
        if (!machineState) {
            await MachineState.create({ machineId: machineId, state: 'started' });
        } else {
            await machineState.update({ state: 'started' });
        }

        // Perform start operation on machine (e.g., send command to start machine)

        res.status(200).json({ message: 'Machine started successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error starting machine in the cluster.', error: error });
    }
};

// PATCH /clusters/:clusterId/machines/:machineId - Update details of a machine in a cluster
exports.updateMachineDetails = async (req, res) => {
    try {
        const { clusterId, machineId } = req.params;

        // Find the machine in the specified cluster
        const machine = await Machine.findOne({ where: { id: machineId, clusterId: clusterId } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found in the cluster.' });
        }

        // Extract updated machine details from request body
        const { name, ipAddress, instanceType } = req.body;
        console.log(name,ipAddress,instanceType);

        // Update machine details
        await machine.update({
            name: name || machine.name,
            ipAddress: ipAddress || machine.ipAddress,
            instanceType: instanceType || machine.instanceType
        });

        res.status(200).json({ message: 'Machine details updated successfully.', machine: machine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating machine details.', error: error });
    }
};

// POST /clusters/:clusterId/machines/:machineId/tags - Add a tag to a machine
exports.addTagToMachine = async (req, res) => {
    try {
        const { clusterId, machineId } = req.params;
        const { tags } = req.body;

        const tag_array = tags.trim().split(",");
        console.log("tagggg:", tag_array)

        // Find the machine in the specified cluster
        const machine = await Machine.findOne({ where: { id: machineId, clusterId: clusterId } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found in the cluster.' });
        }

        // Add the tag to the machine
        const machineTags = JSON.parse(machine.tags || "[]"); // Parsing JSON string, defaulting to an empty array if machine.tags is not set
        machineTags.push(...tag_array); // Adding new tags to the array
        machine.tags = JSON.stringify(machineTags);

        await machine.save();

        res.status(200).json({ message: 'Tag added to machine successfully.', machine: machine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding tag to machine.', error: error });
    }
};

// DELETE /clusters/:clusterId/machines/:machineId/tags/:tag - Remove a tag from a machine
exports.removeTagFromMachine = async (req, res) => {
    try {
        const { clusterId, machineId, tag } = req.params;

        // Find the machine in the specified cluster
        const machine = await Machine.findOne({ where: { id: machineId, clusterId: clusterId } });
        if (!machine) {
            return res.status(404).json({ message: 'Machine not found in the cluster.' });
        }

        // Remove the tag from the machine
        machine.tags = JSON.stringify(JSON.parse(machine.tags).filter(existingTag => existingTag !== tag));
        await machine.save();

        res.status(200).json({ message: 'Tag removed from machine successfully.', machine: machine });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing tag from machine.', error: error });
    }
};

// POST /clusters/:clusterId/machines/actions - Start, reboot, or stop machines using tags
exports.performActionOnMachinesWithTags = async (req, res) => {
    try {
        const { clusterId } = req.params;
        const { action, tags } = req.body;
        console.log(action, tags)

        // Find machines in the specified cluster with the given tags
        const machines = await Machine.findAll({
            where: {
                clusterId: clusterId,
                tags: {
                    [Op.like]: `%${tags}%`
                }
            },
            include: MachineState
        });

        // Perform the specified action on each machine
        const results = [];
        for (const machine of machines) {
            let result;
            switch (action) {
                case 'start':
                    // Logic to start the machine
                    result = await startMachine(machine);
                    break;
                case 'reboot':
                    // Logic to reboot the machine
                    result = await rebootMachine(machine);
                    break;
                case 'stop':
                    // Logic to stop the machine
                    console.log('machine-stop')
                    result = await stopMachine(machine);
                    break;
                default:
                    result = { machineId: machine.id, status: 'Error', message: 'Invalid action.' };
            }
            results.push(result);
        }

        res.status(200).json({ message: 'Action performed on machines with tags.', results: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error performing action on machines with tags.', error: error });
    }
};

// Helper functions to perform actions on machines
async function startMachine(machine) {
    // Logic to start the machine
    machine.MachineState.state = 'started'
    machine.MachineState.save()
    return { machineId: machine.id, status: 'Success', message: 'Machine started.' };
}

async function rebootMachine(machine) {
    // Logic to reboot the machine
    machine.MachineState.state = 'reboot'
    machine.MachineState.save()
    return { machineId: machine.id, status: 'Success', message: 'Machine rebooted.' };
}

async function stopMachine(machine) {
    // Logic to stop the machine
    machine.MachineState.state = 'stopped'
    machine.MachineState.save()
    return { machineId: machine.id, status: 'Success', message: 'Machine stopped.' };
}
