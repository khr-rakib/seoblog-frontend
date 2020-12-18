import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import { listRelated, singleBlog } from '../../actions/blog';
import { API, APP_NAME, DOMAIN, FB_APP_ID } from '../../config';
import moment from 'moment';
import renderHtml from 'react-render-html';
import SmallCard from '../../components/blog/SmallCard';

const SingleBlog = ({ blog, query }) => {

    const [related, setRelated] = useState([]);

    const loadRelated = () => {
        listRelated({ blog }).then(data => {
            if (data.error) console.log(data.error);
            setRelated(data);
        })
    }

    useEffect(() => {
        loadRelated()
    }, []);

    const head = () => (
        <Head>
            <title>{blog.title} | {APP_NAME}</title>
            <meta name="description" content={`${blog.mdesc}`} />
            <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
            <meta property="og:description" content={blog.mdesc} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
            <meta property="og:app_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta property="fb:app_id" content={`${FB_APP_ID}`} />
        </Head>
    );

    const showBlogCategories = blog => (
        blog.categories.map((c, i) => (
            <Link href={`/categories/${c.slug}`} key={i}>
                <a className="btn btn-primary mx-1 mt-1">{c.name}</a>
            </Link>
        ))
    );

    const showBlogTags = blog => (
        blog.tags.map((t, i) => (
            <Link href={`/tags/${t.slug}`} key={i}>
                <a className="btn btn-outline-primary mx-1 mt-1">{t.name}</a>
            </Link>
        ))
    );

    const showRelatedBlog = () => {
        return related && related.map((blog, i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        ))
    }


    return (
        <>
            {head()}
            <Layout>
                <main>
                    <article>
                        <div className="container">
                            <section>
                                <div className="row">
                                    <img src={`${API}/blog/photo/${blog.slug}`} className="img img-fluid featured_image" alt="" />
                                </div>
                            </section>
                            <section>
                                <h2 className="text-center display-2 py-3">{blog.title}</h2>
                                <p className="lead pt-2 mark"> Written By {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()} </p>
                                <div>
                                    {showBlogCategories(blog)}
                                    {showBlogTags(blog)}
                                </div>
                            </section>
                        </div>
                        <div className="container mt-4">
                            <section>
                                <div className="row">
                                    <div className="col-md-12 lead">
                                        {renderHtml(blog.body)}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="container mt-3">
                            <h4 className="text-center ">Related Posts</h4>
                            <hr />
                            <div className="row">
                                {showRelatedBlog()}
                            </div>
                        </div>
                        <div className="container mt-3">
                            <p className="text-center ">show comments</p>
                        </div>
                    </article>
                </main>
            </Layout>
        </>
    )
}

SingleBlog.getInitialProps = ({ query }) => {
    return singleBlog(query.slug).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return { blog: data, query }
        }
    })
}


export default SingleBlog;