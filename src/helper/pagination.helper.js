const getPaginationData = (total, offset, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        page: Math.floor(offset / limit) + 1,
        limit: limit,
        total: parseInt(total),
        totalPages: totalPages,
        hasNext: offset + limit < total,
        hasPrev: offset > 0

    }

}
module.exports = {
    getPaginationData
}