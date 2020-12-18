import Link from 'next/link';
import renderHtml from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';


const Card = ({ blog }) => {

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

    return (
        <div className="lead pb-4">
            <header>
                <Link href={`/blogs/${blog.slug}`}>
                    <a><h2 className="py-3">{blog.title}</h2></a>
                </Link>
            </header>
            <section>
                <p className="mark">
                    Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                </p>
            </section>
            <section>
                <p>{showBlogCategories(blog)} {showBlogTags(blog)}</p>

            </section>
            <section className="row">
                <div className="col-md-4">
                    <section>
                        <img className="img-fluid img" style={{ maxHeight: "150px", width: "auto" }} src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} />
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        <div>
                            {renderHtml(blog.excerpt)}
                        </div>
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-primary my-3">Read More</a>
                        </Link>
                    </section>
                </div>
            </section>
        </div>
    );
};

export default Card;