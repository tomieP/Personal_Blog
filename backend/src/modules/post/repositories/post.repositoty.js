import prisma from "../../../config/prisma";

// CREATE
const createPost = async (data) => {
    return prisma.post.create({
        data,
    });
};

//READ
const findPost = async ({
  where = {},
  select,
  include,
} = {}) => {
  return prisma.post.findFirst({
    where: {
      ...where,
      deletedAt: null,
    },
    ...(select && { select }),
    ...(include && { include }),
  });
};

const findPosts = async ({
    where = {},
    skip,
    take,
    orderBy,
    select,
    include,
    } = {}) => {
        return prisma.post.findMany({
            where:{
                ...where,
                deletedAt: null
            },
            skip,
            take,
            orderBy,
            ...(select && {select}),
            ...(include && {include})
        });
    };

const countPosts = async({
    where = {},
}) => {
    return prisma.post.count({
        where:{
            ...where,
            deletedAt : null
        }
    });
};

//UPDATE
const updatePost = async ({
    where,
    data
}) => {
    return prisma.post.update({
        where,
        data
    });
};

//DELETE
const softDeletePost = async ({
    where
}) => {
    return prisma.post.update({
        where,
        data:{deletedAt: new Date()}
    });
};

//SEARCH
const searchPosts = async({
    query,
    skip = 0,
    take = 10,
}) => {
    return prisma.$queryRaw`
    SELECT
            id,
            title,
            slug,
            "publishedAt",
            ts_rank(
                "searchVector",
                plainto_tsquery('simple', ${query})
            ) AS rank
        FROM "Post"
        WHERE
            "status" = 'APPROVED'
            AND "deletedAt" IS NULL
            AND "searchVector" @@ plainto_tsquery('simple', ${query})
        ORDER BY rank DESC, "publishedAt" DESC
        OFFSET ${skip}
        LIMIT ${take};
    `
}

const countSearchPosts = async ({
    query,
}) => {
    const result = await prisma.$queryRaw`
        SELECT COUNT(*)::int AS count
        FROM "Post"
        WHERE
            "status" = 'APPROVED'
            AND "deletedAt" IS NULL
            AND "searchVector" @@ plainto_tsquery('simple', ${query});
    `;

    return result[0].count;
};

export {
    createPost,
    findPost,
    findPosts,
    updatePost,
    softDeletePost,
    countPosts,
    searchPosts,
    countSearchPosts    
};