import {postRepository} from "../repositories/post.repositoty.js";
import slugify from "slugify";
import {nanoid} from "nanoid";

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

    let postSlug = slug;
    if(!postSlug){
        if(title){
            postSlug = `${slugify(title,{
                lower: true,
                strict:true,
                locale: true,
            })}-${nanoid(9)}`;
        }
        else{
            postSlug = `draft-${nanoid(9)}`;
        }
    }

    const existingPost = await postRepository.findPost({
        where:{
            slug: postSlug
        },
        select:{
            id:true
        }
    });

    if(existingPost){
        throw new Error("Slug already exists");
    }

    const post = await postRepository.createPost({
        data:{
            title,
            content,
            slug: postSlug,
            authorId,
            status: "DRAFT",
            publishedAt: null,
            deleteAt: null,
        },
        select:{
            id: true,
            slug: true,
            title: true,
            content: true,
            authorId: true,
            status: true,
            createdAt: true,
            updatedAt: true
        },
    });
    return post
}
//const getMyPosts
//const getMyPostById
export{
    // PUBLIC
    getPublishedPosts,
    getPublishedPostBySlug,
    searchPublishedPosts,

    createDraftPost

    
}
