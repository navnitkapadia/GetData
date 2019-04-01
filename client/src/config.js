if(process.env.NODE_ENV === "development"){
    module.exports = {
        socketIo: "http://localhost:5000/",
    };
} else {
    module.exports = {
        socketIo: "https://serene-wildwood-93663.herokuapp.com/",
    };
}