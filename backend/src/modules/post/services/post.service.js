import {postRepository} from "../repositories/post.repositoty.js"

const getPublishedPosts = async({
    page = 1,
    limit = 10
}) => {
    const skip = (page - 1) * limit

    const where = {
        status: "APPROVED"
    }

    const [posts, total] = await Promise.all([
        postRepository.findPosts({
            where,
            skip,
            take: limit,
            orderBy: {
                publishedAt: "desc",
            },
            select: {
                id: true,
                title: true,
                slug: true,
                thumbnail: true,
                publishedAt: true,
            },
        }),

        postRepository.countPosts({
            where,
        }),
    ]);

    return {
        data: posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}; 

const getPublishedPostBySlug = async(slug) =>{
    const post = await postRepository.findPost({
        where:{
            slug,
            status: "APPROVED",
        },
         include: {
            author: {
                select: {
                    id: true,
                    username: true,
                    avatarUrl: true,
                },
            },
        },
    });
    if (!post){
        throw new Error("Post not found")
    };
    return post;
};

const searchPublishedPosts = async (
    query,
    page = 1,
    limit = 10,
) => {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
        postRepository.searchPosts({
            query,
            skip,
            take: limit,
        }),

        postRepository.countSearchPosts({
            query,
        }),
    ]);

    return {
        data: posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export{
    // PUBLIC
    getPublishedPosts,
    getPublishedPostBySlug,
    searchPublishedPosts,

    
}
