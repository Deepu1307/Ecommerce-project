module.exports = (fn) => {
  return (req, res, next) => {
    console.log(fn);
    fn(req, res, next).catch(next);
  };
};
