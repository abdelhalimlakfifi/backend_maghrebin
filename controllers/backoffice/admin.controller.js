const getAdmin = (req, res) => {
    res.json({
        message: "Authenticated"
    });
}


module.exports = { getAdmin }