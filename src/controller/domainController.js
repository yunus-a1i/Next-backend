import Domain from '../models/domainModel.js';

export async function createDomain(req, res, next) {
  try {
    const { domainName } = req.body;

    if (!domainName) {
      return res.status(400).json({
        success: false,
        message: 'Domain name is required.',
      });
    }

    const existingDomain = await Domain.findOne({ domainName });
    if (existingDomain) {
      return res.status(409).json({
        success: false,
        message: 'Domain already exists.',
      });
    }

    let domain = new Domain({ domainName });
    domain = await domain.save();

    return res.status(201).json({
      success: true,
      message: 'New domain created successfully.',
      data: domain,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function getDomain(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Domain id is required.',
      });
    }

    const domain = await Domain.findById(id);
    if (!domain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Domain found.',
      data: domain,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllDomain(req, res, next) {
  try {
    const allDomain = await Domain.find();

    return res.status(200).json({
      success: true,
      message: 'Domains fetched successfully.',
      data: allDomain.length > 0 ? allDomain : [],
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDomain(req, res, next) {
  try {
    const { id } = req.params;
    const { domainName } = req.body;

    if (!id || !domainName) {
      return res.status(400).json({
        success: false,
        message: 'Domain id and domain name are required.',
      });
    }

    const updatedDomain = await Domain.findByIdAndUpdate(id, { domainName }, { new: true });

    if (!updatedDomain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Domain updated successfully.',
      data: updatedDomain,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDomain(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Domain id is required.',
      });
    }

    const deletedDomain = await Domain.findByIdAndDelete(id);

    if (!deletedDomain) {
      return res.status(404).json({
        success: false,
        message: 'Domain not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Domain deleted successfully.',
      data: deletedDomain,
    });
  } catch (error) {
    next(error);
  }
}
