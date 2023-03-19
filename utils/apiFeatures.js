class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    };
    filter() {
        const queryStrObj = { ...this.queryString };
        const excludesFields = ['page', 'sort', 'limit', 'fields'];
        excludesFields.forEach((field) => delete queryStrObj[field]);
        const queryStr = JSON.stringify(queryStrObj);
        const queryObjFiltertion = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));
        if (Object.keys(queryObjFiltertion).length > 0 && !queryObjFiltertion.keyword) {
            this.mongooseQuery = this.mongooseQuery.find(queryObjFiltertion);
        }
        return this;
    };
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt');
        };
        return this;
    };
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');  
        }
        return this;
    };
    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
                if (modelName === 'Products') {
                    query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
                } else {
            query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
        }
                this.mongooseQuery =  this.mongooseQuery.find(query);
        }
        return this;
    };
    paginte(countDocument) {
        
        const page  = this.queryString.page * 1 || 1;
        const limit  = this.queryString.limit * 1 || 50;
        const skip = (page - 1) * limit;
        const endIndex = limit * page;

        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocument / limit);
        
        //next Page
        if (endIndex < countDocument)
            pagination.next = page + 1;
        if (skip > 0)
            pagination.prev = page - 1;
        
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }
};

module.exports = ApiFeatures