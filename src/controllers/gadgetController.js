const client = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const generateCodename = () => {
  const codenames = [
    "The Nightingale", "The Kraken", "The Phantom", "The Viper",
    "The Shadow", "The Falcon", "The Specter", "The Cobra",
    "The Phoenix", "The Wraith", "The Ghost", "The Tempest",
    "The Reaper", "The Serpent", "The Mirage"
  ];
  
  return codenames[Math.floor(Math.random() * codenames.length)];
};

const generateSuccessProbability = () => Math.floor(Math.random() * 100) + 1;

const getAllGadgets = async (req, res) => {
  try {
    const gadgets = await client.gadget.findMany();
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget,
      missionSuccessProbability: `${generateSuccessProbability()}%`
    }));
    res.status(200).json(gadgetsWithProbability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addGadget = async (req, res) => {
  try {
    const name = generateCodename();
    const newGadget = await client.gadget.create({
      data: { name }
    });
    res.status(201).json({
      message: "Gadget added successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGadget = await client.gadget.update({
      where: { id },
      data: req.body
    });
    res.status(200).json(updatedGadget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const decommissionGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGadget = await client.gadget.update({
      where: { id },
      data: {
        status: "Decommissioned",
        decommissionedAt: new Date()
      }
    });
    res.status(200).json({ message: "Gadget decommissioned", gadget: updatedGadget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selfDestructGadget = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmationCode = uuidv4();

    await client.gadget.update({
      where: { id },
      data: { status: "Destroyed" }
    });

    res.status(200).json({
      message: "Self-destruct sequence initiated.",
      confirmationCode
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllGadgets,
  addGadget,
  updateGadget,
  decommissionGadget,
  selfDestructGadget
}