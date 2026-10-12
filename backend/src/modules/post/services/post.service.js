import {postRepository} from "../repositories/post.repositoty.js";
import {createUniqueSlug} from "../../../utils/custom_slugify.js"

//===================
//      PUBLIC
//===================
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

//===================
//      USER
//===================

const createDraftPost = async ({
    authorId,
    title,
    content,
    slug,
}) => {
    // Ưu tiên slug user nhập; nếu không có thì dùng title.
    const slugSource = slug?.trim() || title;
    const postSlug = createUniqueSlug(slugSource);

    const existingPost = await postRepository.findPost({
        where: { slug: postSlug },
        select: { id: true },
    });

    if (existingPost) {
        throw new Error("Slug already exists");
    }

    return postRepository.createPost({
        data: {
            title,
            content,
            slug: postSlug,
            authorId,
            status: "DRAFT",
            publishedAt: null,
            deletedAt: null,
        },
        select: {
            id: true,
            slug: true,
            title: true,
            content: true,
            authorId: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const getMyPosts = async({
    authorId,
    page = 1,
    limit = 10,
    status,
    sort = "latest",
}) => {
    const skip = (page - 1)* limit;

    const where = {
        authorId,
        ...(status && {status}),
    };

    const orderBy = {
        createdAt: sort == "latest" ? "desc" : "asc"
    };

     const [posts, total] = await Promise.all([
        postRepository.findPosts({
            where,
            skip,
            take: limit,
            orderBy,
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
                createdAt: true,
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

const getMyPostById = async({
    postid,
    authorId,
}) => {
    const post = await postRepository.findPost({
        where: {
            id: postid
        },
        select: {
            id: true,
            title: true,
            content: true,
            slug: true,
            status: true,
            rejectReason: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if(!post){
        throw new Error("Post not found")
    };

    if(post.authorId != authorId ){
        throw new Error("post not found")
    };

    const {
        authorId: _authorId,
        ...postDetail
    } = post;

    return postDetail
}

export{
    // PUBLIC
    getPublishedPosts,
    getPublishedPostBySlug,
    searchPublishedPosts,
    
    //USER
    createDraftPost,
    getMyPosts,
    getMyPostById,
}
