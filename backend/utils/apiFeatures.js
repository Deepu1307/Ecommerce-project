class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  // First method
  //   search() {
  //     const keyword = this.queryString.keyword
  //       ? {
  //           name: {
  //             $regex: this.queryString.keyword,
  //             $options: "i",
  //           },
  //         }
  //       : {};
  //     this.query = this.query.find({ ...keyword });
  //     return this;
  //   }
  // Second method
  //   search() {
  //     const keyword = this.queryString.keyword
  //       ? {
  //           $text: {
  //             $search: this.queryString.keyword,
  //             $caseSensitive: false,
  //           },
  //         }
  //       : {};
  //     this.query = this.query.find({ ...keyword });
  //     return this;
  //   }

  // Third method
  search() {
    if (this.queryString.keyword) {
      const regex = new RegExp(this.queryString.keyword, "i");
      this.query = this.query.find({ name: regex });
    } else {
      this.query = this.query.find();
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["keyword", "sort", "fields", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fieldsLimit = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fieldsLimit);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const currentPage = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skipItem = (currentPage - 1) * limit;
    this.query = this.query.skip(skipItem).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
