import Link from 'next/link';
import renderHtml from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';


const SmallCard = ({ blog }) => {
    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img className="img-fluid card-img-top" style={{ maxHeight: "150px", width: "auto" }} src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} />
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <h5>
                            {blog.title}
                        </h5>
                    </Link>
                    <p>{renderHtml(blog.excerpt)}</p>
                </section>
            </div>
            <div className="card-body">
                <Link href={`/blogs/${blog.slug}`}>
                    <a className="btn btn-primary my-3">Read More</a>
                </Link>
                Posted {moment(blog.updatedAt).fromNow()} by {blog.postedBy.name}
            </div>
        </div>

    );
};

export default SmallCard;