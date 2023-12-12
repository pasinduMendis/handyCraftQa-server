const transformToModel = (data) => {
  const obj = data.toObject();
  return {
    ...obj,
    id: obj._id,
    _id: undefined,
    __v: undefined,
    password: undefined,
  };
};

module.exports = { transformToModel };
