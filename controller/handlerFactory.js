
const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');

exports.createOne = (model) => asyncHandler(async (req, res) => {
    const newDocument = await model.create(req.body)
res.status(StatusCodes.CREATED).json({ data: newDocument });
});

exports.getAll = (model,modelName="") => asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObject) {
        filter = req.filterObject
    };
    // Bulid query
    const countDocument = await model.countDocuments();
    const { mongooseQuery, paginationResult } = new ApiFeatures(model.find(filter), req.query)
        .paginte(countDocument)
        .filter()
        .search(modelName)
        .limitFields()
        .sort()
    // if(model)
    // Execute query
    const documents = await mongooseQuery;
    res.status(StatusCodes.OK).json({ results: documents.length, paginationResult, data: documents });
});

exports.getOne = (model,populationOpts) =>
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        // Bulid Quety
        let query = await model.findById(id);
        if (populationOpts)
            query = query.populate(populationOpts);
        // Execute Query
        const document = await query;
        if (!document)
            throw new NotFoundError(`Not have document for this id: ${id}`)
        res.status(StatusCodes.OK).json({ data: document });
});

exports.updateOne = (model) => asyncHandler(async (req, res) => {
    const document = await model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true });
    if (!document)
        throw new NotFoundError(`Not have brand for this id: ${id}`)
    
    // Trigger "save" event when update document
    document.save();

    res.status(StatusCodes.OK).json({ data: document });
});


exports.deleteOne = (model) => asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await model.findByIdAndRemove(id);
    if (!document)
        throw new NotFoundError(`Not have brand for this id: ${id}`)
    
    // Trigger "remove" event when remove document
    document.remove();
    res.status(StatusCodes.NO_CONTENT).end();
})