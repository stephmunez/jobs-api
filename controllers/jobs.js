const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort('createdAt');
  res.status(StatusCodes.OK).send({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { user, params } = req;
  const job = await Job.findOne({ _id: params.id, createdBy: user._id });

  if (!job) {
    throw new NotFoundError(`No job with id ${params.id}`);
  }

  res.status(StatusCodes.OK).send({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).send({ job });
};

const updateJob = async (req, res) => {
  const { user, params, body: {company, position} } = req;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or position fields cannot be empty')
  }

  const job = await Job.findOneAndUpdate({ _id: params.id, createdBy: user._id }, req.body, {new: true, runValidators: true});

  if (!job) {
    throw new NotFoundError(`No job with id ${params.id}`);
  }

  res.status(StatusCodes.OK).send({ job });
};

const deleteJob = async (req, res) => {
  const { user, params } = req;
  const job = await Job.findOneAndRemove({ _id: params.id, createdBy: user._id });

  if (!job) {
    throw new NotFoundError(`No job with id ${params.id}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
