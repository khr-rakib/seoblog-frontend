import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog } from '../../actions/blog';
import moment from 'moment';

const BlogRead = ({ router }) => {
    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState("");

    const token = getCookie('token');

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = () => {
        list().then(data => {
            if (data.error) return console.log(data.error);
            setBlogs(data);
        })
    }

    const deleteBlog = slug => {
        removeBlog(slug, token).then(data => {
            if (data.error)
                return console.log(data.error);
            else {
                setMessage(data.msg)
                loadBlogs()
            }
        })
    }

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure you want to delete?');
        if (answer) {
            deleteBlog(slug);
        }
    }

    const showUpdateButton = blog => {
        if (isAuth() && isAuth().role === 0) {
            return (
                <Link href={`/user/crud/blog/${blog.slug}`}>
                    <a className="btn btn-sm btn-info">Update</a>
                </Link>
            );
        } else if (isAuth() && isAuth().role === 1) {
            return (
                <Link href={`/admin/crud/${blog.slug}`}>
                    <a className="btn btn-sm btn-info">Update</a>
                </Link>
            );
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => (
            <div key={i} className="pb-4">
                <h3>{blog.title}</h3>
                <p className="mark">Written by {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}</p>
                <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>Delete</button>
                {showUpdateButton(blog)}
            </div>
        ))
    }


    return <>
        <div className="row">
            <div className="col-md-12">
                {message && <div className="alert alert-warning">{message}</div>}
                {showAllBlogs()}
            </div>
        </div>
    </>
}



export default BlogRead;