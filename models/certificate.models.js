
const Certificate = require('./certificate.mongo');


const getCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.find();
        res.render('home',{certificate})
    } catch (error) {
        console.log(error)
    }
}

const addCertificate = async (req, res) => {
    try {
        const { Name } = req.body;
        const image = req.file.filename;

        const newCertificate = new Certificate({ Name, image });
        await newCertificate.save();

        res.status(201).json({ message: 'Certificate added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding certificate', error });
    }
};

const removeCertificate = async (req, res) => {
    try {
        const { id } = req.body;
        await Certificate.findByIdAndDelete(id);

        res.status(200).json({ message: 'Certificate removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing certificate', error });
    }
};

module.exports = { getCertificate, addCertificate, removeCertificate };
