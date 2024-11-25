exports.handle404s = (req, res) => {
    res.status(404).send({ msg: "Route Not Found" });
};

exports.handleArticleIdNotFound = (err, req, res, next) => {
if(err.code === "INVALID_ID"){
    res.status(404).send({ msg: err.msg });
} else {
     next(err);
}};

exports.handle400s = (err, req, res, next) => {
    if(err.status === 400){
        res.status(400).send({ msg: err.msg});
    } else {
        next(err);
    }};