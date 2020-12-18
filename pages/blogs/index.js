import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import { API, APP_NAME, DOMAIN, FB_APP_ID } from '../../config';
import Card from '../../components/blog/Card';


const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogSkip, router }) => {
    const head = () => (
        <Head>
            <title>Programming Blogs | {APP_NAME}</title>
            <meta name="description" content="Programming blogs and tutorial and next vue php laravel web development" />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta property="og:title" content={`Latest web development tutorial | ${APP_NAME}`} />
            <meta property="og:description" content="Programming blogs and tutorial and next vue php laravel web development" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:app_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    );



    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);


    const loadMore = () => {
        let toSkip = skip + limit;
        listBlogsWithCategoriesAndTags(toSkip, limit).then(data => {
            if (data.error) return console.log(data.error);

            setLoadedBlogs([...loadedBlogs, ...data.blogs]);
            setSize(data.size);
            setSkip(toSkip);
        });
    }

    const loadMoreButton = () => (
        size > 0 && size >= limit && (
            <button className="btn btn-outline-secondary btn-lg" onClick={loadMore}>Load More</button>
        )
    )


    const showAllCategories = () => (
        categories.map((c, i) => (
            <Link href={`/categories/${c.slug}`} key={i}>
                <a className="btn btn-primary mx-1 mt-2">{c.name}</a>
            </Link>
        ))
    )

    const showAllTags = () => (
        tags.map((t, i) => (
            <Link href={`/tags/${t.slug}`} key={i}>
                <a className="btn btn-outline-primary mx-1 mt-2">{t.name}</a>
            </Link>
        ))
    )

    const showAllBlogs = () => {
        return blogs.map((blog, i) => (
            <article key={i}>
                <Card blog={blog} />
                <hr />
            </article>
        ))
    }

    const showLoadedBlogs = () => (
        loadedBlogs.map((blog, i) => (
            <article key={i}>
                <Card blog={blog} />
            </article>
        ))
    )


    return (
        <>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="display-2 font-weight-bold text-center">Programming Blogs & Tutorial</h1>
                            </div>
                            <section>
                                <p>{showAllCategories()} {showAllTags()} </p>
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">{showAllBlogs()}</div>
                    <div className="container-fluid">{showLoadedBlogs()}</div>
                    <div className="container-fluid text-center py-5">{loadMoreButton()}</div>
                </main>
            </Layout>
        </>
    )
}

Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 2;
    return (
        listBlogsWithCategoriesAndTags(skip, limit).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                return {
                    blogs: data.blogs,
                    categories: data.categories,
                    tags: data.tags,
                    totalBlogs: data.size,
                    blogsLimit: limit,
                    blogSkip: skip
                };
            }


        })
    )
}

export default withRouter(Blogs);
